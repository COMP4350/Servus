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
import { Grid, IconButton, FormControl } from '@material-ui/core/';

const useStyles = makeStyles(() => ({
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
    },
    servicesContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
    },
    serviceForm: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: '50px',
    },
    formControl: {
        margin: '10px',
    },
    durationSelect: {
        width: '80%',
    },
    tagSelectLabel: {
        width: '80%',
        marginTop: '20px',
        marginBottom: '4px',
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
    const handleTagChange = event => {
        setServiceTags(event.target.value);
    };
    const handleTagDelete = chipToDelete => () => {
        console.log(chipToDelete);
        setServiceTags(chips => chips.filter(chip => chip !== chipToDelete));
    };
    const [serviceForm, onServiceFormChange] = useForm({
        name: '',
        description: '',
        cost: '',
    });
    const [serviceDuration, setServiceDuration] = useState(0);
    const [serviceDisplayDuration, setServiceDisplayDuration] = useState('30 minutes');
    const [servicesErrors, setServiceErrors] = useState({});
    const [serviceFormValid, setServiceFormValid] = useState({});
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
        if (serviceDuration.length != 4) {
            errors.duration = 'duration is required';
        }
        if (!serviceForm.startTime) {
            errors.availability = 'start time is required';
        }
        if (!serviceForm.endTime) {
            errors.availability = 'end time is required';
        }
        if (serviceForm.weekday < 0 || serviceForm.weekday > 6) {
            errors.availability = 'availability is required';
        }
        if (Object.getOwnPropertyNames(location).length == 0) {
            errors.location = 'location is required';
        }
        setServiceErrors(errors);
        setServiceFormValid(Object.getOwnPropertyNames(errors).length === 0);
    };
    const addService = () => {
        if (serviceFormValid) {
            axios
                .post(
                    '/services',
                    {
                        username: cookies.username,
                        name: serviceForm.name,
                        description: serviceForm.description,
                        cost: serviceForm.cost,
                        duration: serviceDuration,
                        availability: buildAvailabilities(),
                        location: {
                            lat: location.lat,
                            lng: location.lng,
                            address: location.address,
                        },
                        ratings: [],
                        tags: serviceTags,
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

            return;
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
                    variant="contained"
                    className={classes.button}
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

    let durationOptions = {
        '0005': '5 minutes',
        '0010': '10 minutes',
        '0015': '15 minutes',
        '0020': '20 minutes', 
        '0025': '25 minutes', 
        '0030': '30 minutes', 
        '0035': '35 minutes', 
        '0040': '40 minutes', 
        '0045': '45 minutes', 
        '0050': '50 minutes', 
        '0100': '1 hour', 
        '0115': '1 hour 15 minutes', 
        '0130': '1 hour 30 minutes', 
        '0145': '1 hour 45 minutes', 
        '0200': '2 hours'};
    const handleDurationChange = (duration) => {
        setServiceDisplayDuration(duration);

        // Get HHMM format from human readable input  
        let formattedTime = Object.keys(durationOptions).find(key => durationOptions[key] === duration);
        console.log([duration, formattedTime]);
        setServiceDuration(formattedTime);
    }

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
                />
                <TextField
                    className={classes.textField}
                    label="Service Description"
                    name="description"
                    value={serviceForm.description}
                    onChange={onServiceFormChange}
                    error={servicesErrors.description}
                />
                <TextField
                    className={classes.textField}
                    label="Service Cost"
                    name="cost"
                    value={serviceForm.cost}
                    onChange={onServiceFormChange}
                    error={servicesErrors.cost}
                />
                <FormControl className={classes.durationSelect}>
                    <InputLabel id="durationLabel">
                        Service Duration
                    </InputLabel>
                    <Select
                        labelId="durationLabel"
                        value={serviceDisplayDuration}
                        onChange={x => handleDurationChange(x.target?.value)}>
                        {Object.values(durationOptions).map((x, i) => {
                            return (
                                <MenuItem key={i} value={x}>
                                    {x}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
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
                <div className={classes.timeContainer}>
                    <TextField
                        id="time"
                        label="Availability Start"
                        type="time"
                        name="startTime"
                        value={serviceForm.startTime}
                        defaultValue="07:30"
                        className={classes.timeField}
                        onChange={onServiceFormChange}
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
                        value={serviceForm.endTime}
                        defaultValue="07:30"
                        className={classes.timeField}
                        onChange={onServiceFormChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 15 min
                        }}
                    />
                    <TextField
                        id="select"
                        label="Availability Weekday"
                        name="weekday"
                        value={serviceForm.weekday}
                        onChange={onServiceFormChange}
                        select
                        className={classes.timeField}>
                        <MenuItem value={0}>Monday</MenuItem>
                        <MenuItem value={1}>Tuesday</MenuItem>
                        <MenuItem value={2}>Wednesday</MenuItem>
                        <MenuItem value={3}>Thursday</MenuItem>
                        <MenuItem value={4}>Friday</MenuItem>
                        <MenuItem value={5}>Saturday</MenuItem>
                        <MenuItem value={6}>Sunday</MenuItem>
                    </TextField>
                </div>
                <InputLabel id="tag-select-label">Tags</InputLabel>
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
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={validateService}>
                    Add Service
                </Button>
            </div>
        </div>
    );
};

export default AddService;
