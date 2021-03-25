import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, MenuItem } from '@material-ui/core';
import useForm from '../hooks/useForm';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { mapLibraries, autocompleteOptions } from '../components/map/mapUtils';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        margin: '2%',
    },
    textField: {
        width: '50%',
        marginBottom: '3%',
    },
    timeField: {
        width: '30%',
    },
    timeContainer: {
        width: '50%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    addressSearch: {
        width: '50%',
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
    },
    serviceForm: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: '50px',
    },
}));

const Services = () => {
    const classes = useStyles();
    const [cookies] = useCookies(['username']);
    const [addingService, setAddingService] = useState(false);
    const [location, setLocation] = useState({});
    //const [numAvailabilities, setNumAvailabilities] = useState(1);
    const [serviceForm, onServiceFormChange] = useForm({
        name: '',
        description: '',
        cost: '',
        duration: '',
        startTime: '',
        endTime: '',
        weekday: 0,
    });
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
        if (!serviceForm.duration) {
            errors.duration = 'duration is required';
        }
        if (!serviceForm.startTime) {
            errors.availability = 'availability is required';
        }
        if (!serviceForm.endTime) {
            errors.availability = 'availability is required';
        }
        if (serviceForm.weekday < 0 || serviceForm.weekday > 6) {
            errors.availability = 'availability is required';
        }
        if (Object.getOwnPropertyNames(location).length == 0) {
            errors.location = 'location is required';
        }
        setServiceErrors(errors);
        setServiceFormValid(Object.getOwnPropertyNames(errors).length == 0);
    };
    const addService = () => {
        if (serviceFormValid) {
            console.log(serviceForm);
            console.log(location);
            axios
                .post(
                    '/services',
                    {
                        username: cookies.username,
                        name: serviceForm.name,
                        description: serviceForm.description,
                        cost: serviceForm.cost,
                        duration: serviceForm.duration,
                        availability: {
                            weekday: serviceForm.weekday,
                            start_time: serviceForm.startTime,
                            end_time: serviceForm.endTime,
                        },
                        location: {
                            lat: location.lat,
                            lng: location.lng,
                            address: location.address,
                        },
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    alert('Service added successfully');
                })
                .catch(err => {
                    alert(err);
                    setServiceFormValid(false);
                });
            setServiceFormValid(false);
            setAddingService(false);
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
        console.log(autocomplete.current?.getPlace().geometry?.location.lat());
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

    return (
        <div className={classes.servicesContainer}>
            {!addingService ? (
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={() => setAddingService(true)}>
                    Add Service
                </Button>
            ) : null}
            {addingService ? (
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
                    <TextField
                        className={classes.textField}
                        label="Service Duration"
                        name="duration"
                        value={serviceForm.duration}
                        onChange={onServiceFormChange}
                        error={servicesErrors.duration}
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

                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={validateService}>
                        Add Service
                    </Button>
                </div>
            ) : null}
        </div>
    );
};

export default Services;
