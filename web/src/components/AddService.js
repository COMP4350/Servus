import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField, MenuItem } from '@material-ui/core';
import useForm from '../hooks/useForm';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { mapLibraries, autocompleteOptions } from './map/mapUtils';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { tagNames } from './FilterList';
import { serviceIconMap } from './ServiceIconMap';
import { Grid, IconButton } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({
    textField: {
        width: '80%',
        marginBottom: '3%',
    },
    timeField: {
        width: '30%',
    },
    timeContainer: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    addressSearch: {
        width: '80%',
        marginBottom: '3%',
        color: 'white',
        zIndex: 1000,
    },
    addressField: {
        width: '100%',
    },
    button: {
        textTransform: 'capitalize',
        marginRight: '10px',
        marginTop: '20px',
    },
    buttonContainer: {
        display: 'flex',
        marginTop: '10px',
        justifyContent: 'center',
        backgroundColor: theme.background.dark,
        width: '100%',
    },
    servicesContainer: {
        width: '100%',
        backgroundColor: theme.background.dark,
        height: '100%',
        color: 'white',
    },
    serviceForm: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: theme.background.dark,
    },
    formControl: {
        margin: '10px',
    },
    tagSelectLabel: {
        marginTop: '10px',
        marginBottom: '10px',
    },
    tagSelect: {
        width: '100%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    iconGrid: {
        margin: 0,
        width: '80%',
        marginTop: '16px',
    },
    daysContainer: {
        width: '60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '10px',
        marginBottom: '20px',
    },
    dayButton: {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 100,
        height: '24px',
        width: '24px',
        textAlign: 'center',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    timesContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const getStyles = (name, serviceTags, theme) => {
    return {
        fontWeight:
            serviceTags.indexOf(theme) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
};

const AddService = ({ addedService }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [cookies] = useCookies(['username']);
    const [location, setLocation] = useState({});
    const [serviceTags, setServiceTags] = useState([]);
    const [serviceIconName, setServiceIconName] = useState({});
    const [day, setDay] = useState(0);
    const [availabilities, setAvailabilities] = useState([
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ]);
    const handleTagChange = event => {
        setServiceTags(event.target.value);
    };
    const handleTagDelete = chipToDelete => () => {
        console.log(chipToDelete);
        setServiceTags(chips => chips.filter(chip => chip !== chipToDelete));
    };
    const handleIconClick = iconName => () => {
        setServiceIconName(iconName);
    };
    const [serviceForm, onServiceFormChange] = useForm({
        name: '',
        description: '',
        cost: '',
        duration: '',
    });
    const [servicesErrors, setServiceErrors] = useState({});
    const [serviceFormValid, setServiceFormValid] = useState(false);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        libraries: mapLibraries,
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    });
    let autocomplete = useRef();
    const validateService = () => {
        let errors = {};
        if (!serviceForm.name) {
            errors.name = 'name is required';
        }
        if (!serviceForm.description) {
            errors.description = 'description is required';
        }
        if (!serviceForm.cost) {
            errors.cost = 'cost is required';
        }
        if (!serviceForm.duration) {
            errors.duration = 'duration is required';
        }
        if (Object.getOwnPropertyNames(location).length == 0) {
            errors.location = 'location is required';
        }
        setServiceErrors(errors);
        setServiceFormValid(Object.getOwnPropertyNames(errors).length === 0);
    };
    const buildAvailabilities = () => {
        let requestAvailabilities = [];
        availabilities.forEach((day, index) => {
            day.filter(
                availability =>
                    availability.startTime !== '' && availability.endTime !== ''
            );
            day.forEach(availability =>
                requestAvailabilities.push({
                    weekday: index,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                })
            );
        });
        return requestAvailabilities;
    };
    const addService = () => {
        console.log(serviceIconName);
        if (serviceFormValid) {
            axios
                .post(
                    '/services',
                    {
                        username: cookies.username,
                        name: serviceForm.name,
                        description: serviceForm.description,
                        cost: serviceForm.cost,
                        duration: serviceForm.duration,
                        availability: buildAvailabilities(),
                        location: {
                            lat: location.lat,
                            lng: location.lng,
                            address: location.address,
                        },
                        tags: serviceTags,
                        icon_name: serviceIconName,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    alert('Service added successfully');
                    setServiceFormValid(false);
                    addedService();
                })
                .catch(() => {
                    setServiceFormValid(false);
                });
        }
    };
    useEffect(() => {
        addService();
    }, [serviceFormValid]);
    const onAutoCompleteLoad = useCallback(autocompleteLoaded => {
        autocomplete.current = autocompleteLoaded;
    }, []);
    const onSearchAddressChanged = () => {
        setLocation({
            lat: autocomplete.current?.getPlace().geometry?.location.lat(),
            lng: autocomplete.current?.getPlace().geometry?.location.lng(),
            address: `${
                autocomplete.current?.getPlace().address_components[0]
                    .short_name
            } ${
                autocomplete.current?.getPlace().address_components[1]
                    .short_name
            }`,
        });
        console.log(location);
    };

    // Create an IconButton for each supported service icon.
    const getGridItem = name => {
        return (
            <Grid
                item
                className={classes.selectableIcon}
                onClick={handleIconClick(name)}>
                <IconButton>{serviceIconMap[name].component}</IconButton>
            </Grid>
        );
    };

    // Return a list of icon components.
    const getGridItems = () => {
        let names = Object.keys(serviceIconMap);
        let gridItems = [];

        names.forEach(name => {
            gridItems.push(getGridItem(name));
        });

        return gridItems;
    };

    const changeDay = dayIndex => {
        setDay(dayIndex);
    };

    const timePickers = (availability, index) => {
        return (
            <div className={classes.timeContainer}>
                <TextField
                    id="time"
                    label="Availability Start"
                    type="time"
                    name="startTime"
                    value={availability.startTime}
                    className={classes.timeField}
                    onChange={event => {
                        let temp = [...availabilities];
                        temp[day][index] = {
                            ...temp[day][index],
                            startTime: event.target.value,
                        };
                        setAvailabilities(temp);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 15 min
                    }}
                />
                <TextField
                    id="time"
                    label="Availability End"
                    type="time"
                    name="endTime"
                    value={availability.endTime}
                    className={classes.timeField}
                    onChange={event => {
                        let temp = [...availabilities];
                        temp[day][index] = {
                            ...temp[day][index],
                            endTime: event.target.value,
                        };
                        setAvailabilities(temp);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 15 min
                    }}
                />
                <Button
                    onClick={() => {
                        let temp = [...availabilities];
                        temp[day].splice(index, 1);
                        setAvailabilities(temp);
                    }}>
                    Remove
                </Button>
            </div>
        );
    };

    const addEmptyAvailability = () => {
        let temp = [...availabilities];
        temp[day].push({ startTime: '', endTime: '' });
        setAvailabilities(temp);
    };

    return (
        <div className={classes.servicesContainer}>
            <div className={classes.serviceForm}>
                <TextField
                    className={classes.textField}
                    label="Service Name"
                    name="name"
                    value={serviceForm.name}
                    onChange={onServiceFormChange}
                    error={servicesErrors.name}
                    helperText={servicesErrors.name}
                />
                {serviceIconMap[serviceIconName]
                    ? serviceIconMap[serviceIconName].component
                    : null}
                <div className={classes.iconGrid}>
                    <Grid container spacing={1}>
                        {getGridItems()}
                    </Grid>
                </div>
                <TextField
                    className={classes.textField}
                    label="Service Description"
                    name="description"
                    value={serviceForm.description}
                    onChange={onServiceFormChange}
                    error={servicesErrors.description}
                    helperText={servicesErrors.description}
                />
                <TextField
                    className={classes.textField}
                    label="Service Cost"
                    name="cost"
                    value={serviceForm.cost}
                    onChange={onServiceFormChange}
                    error={servicesErrors.cost}
                    helperText={servicesErrors.cost}
                />
                <TextField
                    className={classes.textField}
                    label="Service Duration"
                    name="duration"
                    value={serviceForm.duration}
                    onChange={onServiceFormChange}
                    error={servicesErrors.duration}
                    helperText={servicesErrors.duration}
                />
                {isLoaded && (
                    <Autocomplete
                        options={{ ...autocompleteOptions }}
                        onPlaceChanged={onSearchAddressChanged}
                        onLoad={onAutoCompleteLoad}
                        className={classes.addressSearch}>
                        <TextField
                            className={classes.addressField}
                            id="search-address"
                            placeholder="Service Location"
                        />
                    </Autocomplete>
                )}
                <div className={classes.daysContainer}>
                    <div>{day}</div>
                    <div
                        onClick={() => changeDay(0)}
                        className={classes.dayButton}>
                        M
                    </div>
                    <div
                        onClick={() => changeDay(1)}
                        className={classes.dayButton}>
                        T
                    </div>
                    <div
                        onClick={() => changeDay(2)}
                        className={classes.dayButton}>
                        W
                    </div>
                    <div
                        onClick={() => changeDay(3)}
                        className={classes.dayButton}>
                        TR
                    </div>
                    <div
                        onClick={() => changeDay(4)}
                        className={classes.dayButton}>
                        F
                    </div>
                    <div
                        onClick={() => changeDay(5)}
                        className={classes.dayButton}>
                        S
                    </div>
                    <div
                        onClick={() => changeDay(6)}
                        className={classes.dayButton}>
                        U
                    </div>
                </div>
                <div className={classes.timesContainer}>
                    {availabilities[day]?.map((availability, index) => {
                        return timePickers(availability, index);
                    })}
                    <Button onClick={() => addEmptyAvailability()}>
                        Add availability
                    </Button>
                </div>

                <InputLabel
                    className={classes.tagSelectLabel}
                    id="tag-select-label">
                    Tags
                </InputLabel>
                <Select
                    className={classes.tagSelect}
                    labelId="tag-select-label"
                    id="tagSelect"
                    multiple
                    value={serviceTags}
                    onChange={handleTagChange}
                    input={<Input id="select-multiple-tags" />}
                    MenuProps={{
                        getContentAnchorEl: () => null,
                    }}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {selected.map(value => (
                                <Chip
                                    key={value}
                                    label={value}
                                    className={classes.chip}
                                    onDelete={handleTagDelete(value)}
                                    onMouseDown={event => {
                                        event.stopPropagation();
                                    }}
                                />
                            ))}
                        </div>
                    )}>
                    {tagNames.map(name => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, serviceTags, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
                <div className={classes.buttonContainer}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={validateService}>
                        Add Service
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddService;
