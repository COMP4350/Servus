import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { Button, ButtonGroup, TextField, MenuItem } from '@material-ui/core';
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
import { Grid, IconButton, FormControl, ThemeProvider } from '@material-ui/core/';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#647AA3',
        },
        secondary: {
            main: '#EC5732',
        },
        default: {
            main: '#FFF2EB',
        },
    },
    background: {
        dark: '#151515',
        main: '#272727',
    },
    typography: {
        fontFamily: ['Roboto'],
    },
});

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
        alignItems: 'center',
    },
    addressSearch: {
        width: '80%',
        marginBottom: '3%',
        color: 'white',
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
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '4%',
        overflow: 'scroll',
        padding: 10,
        backgroundColor: theme.background.dark,
    },
    formControl: {
        margin: '10px',
    },
    durationSelect: {
        width: '80%',
        marginBottom: '20px', 
    },
    tagSelectLabel: {
        width: '80%',
        marginTop: '20px',
        marginBottom: '4px',
    },
    tagSelect: {
        width: '80%',
    },
    tagSelectText: {
        'align-content': 'left',
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
        justifyContent: 'center',
        marginTop: '10px',
        marginBottom: '20px',
    },
    dayButton: {
        textTransform: 'capitalize',
    },
    selectedDayButton: {
        backgroundColor: 'white',
        color: 'black',
        textTransform: 'capitalize',
    },
    timesContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        marginTop: '24px',
        textTransform: 'capitalize',
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

const days = [
    { index: 0, name: 'Sunday' },
    { index: 1, name: 'Monday' },
    { index: 2, name: 'Tuesday' },
    { index: 3, name: 'Wednesday' },
    { index: 4, name: 'Thursday' },
    { index: 5, name: 'Friday' },
    { index: 6, name: 'Saturday' },
];

const AddService = ({ addedService }) => {
    const classes = useStyles();
    const [cookies] = useCookies(['username']);
    const [location, setLocation] = useState({});
    const [serviceTags, setServiceTags] = useState([]);
    const [serviceIconName, setServiceIconName] = useState('place');
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
    });
    const [serviceDuration, setServiceDuration] = useState(0);
    const [serviceDisplayDuration, setServiceDisplayDuration] = useState(
        '30 minutes'
    );
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
        if (serviceDuration.length != 4) {
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
            day = day.filter(
                availability =>
                    availability.startTime !== '' && availability.endTime !== ''
            );
            day.forEach(availability =>
                requestAvailabilities.push({
                    weekday: index,
                    start_time: availability.startTime,
                    end_time: availability.endTime,
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
                        duration: serviceDuration,
                        availability: buildAvailabilities(),
                        location: {
                            lat: location.lat,
                            lng: location.lng,
                            address: location.address,
                        },
                        ratings: [],
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
        '0200': '2 hours',
    };
    const handleDurationChange = duration => {
        setServiceDisplayDuration(duration);

        // Get HHMM format from human readable input
        let formattedTime = Object.keys(durationOptions).find(
            key => durationOptions[key] === duration
        );
        console.log([duration, formattedTime]);
        setServiceDuration(formattedTime);
    };

    return (
        <ThemeProvider theme={theme}>
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
                    <FormControl className={classes.durationSelect}>
                        <InputLabel id="durationLabel">Service Duration</InputLabel>
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
                    <div className={classes.daysContainer}>
                        <ButtonGroup
                            variant="contained"
                            color="primary"
                            aria-label="contained primary button group">
                            {days.map(currDay => (
                                <Button
                                    variant="contained"
                                    className={
                                        day === currDay.index
                                            ? classes.selectedDayButton
                                            : classes.dayButton
                                    }
                                    key={currDay.index}
                                    onClick={() => changeDay(currDay.index)}>
                                    {currDay.name}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div className={classes.timesContainer}>
                        {availabilities[day]?.map((availability, index) => {
                            return timePickers(availability, index);
                        })}
                        <Button
                            variant="contained"
                            onClick={() => addEmptyAvailability()}
                            className={classes.addButton}>
                            Add availability
                        </Button>
                    </div>

                    <InputLabel
                        className={classes.tagSelectLabel}
                        id="tag-select-label">
                        <div className={classes.tagSelectText}>Tags</div>
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
        </ThemeProvider>
    );
};

export default AddService;
