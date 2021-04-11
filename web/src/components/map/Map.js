import axios from 'axios';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ReactDOM from 'react-dom';
import {
    winnipeg,
    mapLibraries,
    mapOptions,
    autocompleteOptions,
} from './mapUtils';

import {
    Autocomplete,
    GoogleMap,
    useJsApiLoader,
} from '@react-google-maps/api';
import serviceIconMap from '../ServiceIconMap';
import ServiceIcon from '../../images/flag_icon.png';
import ServiceWindow from './ServiceWindow';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    },
    textField: {
        backgroundColor: 'black',
        width: '100%',
        paddingLeft: '10px',
    },
    autocomplete: {
        width: '80%',
    },
    addressContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2%',
        width: '100%',
        color: 'black',
    },
    mapContainer: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: '110px',
        right: '10px',
        borderRadius: '2px',
        padding: '8px',
        '&:hover': { backgroundColor: 'white' },
    },
    icon: {
        '&:hover': { color: 'black' },
    },
}));

const Map = props => {
    const classes = useStyles();
    const [center, setCenter] = useState(winnipeg);
    const [allServices] = useState({});
    let prevWindow = false;
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        libraries: mapLibraries,
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    });

    let marker = useRef();
    let autocomplete = useRef();

    const onMapLoad = useCallback(map => {
        getUserLocation();
        marker.current = new window.google.maps.Marker({
            map,
            anchorPoint: new window.google.maps.Point(0, -29),
        });
        axios.get(`/services/`).then(response => {
            let services = response.data.result;
            services &&
                services.map(service => {
                    let div = document.createElement('div');
                    //build the content string
                    const contentString = (
                        <ServiceWindow
                            history={props.history}
                            service={service}
                        />
                    );
                    ReactDOM.render(contentString, div);

                    const infowindow = new window.google.maps.InfoWindow({
                        content: div,
                    });

                    let markerIcon = service.icon_name
                        ? {
                              path: serviceIconMap[service.icon_name].path,
                              fillColor: '#EC5732',
                              fillOpacity: 1,
                              strokeWeight: 0,
                              scale: 1,
                          }
                        : ServiceIcon;

                    let serviceMarker = new window.google.maps.Marker({
                        map,
                        position: {
                            lat: service.location.lat,
                            lng: service.location.lng,
                        },
                        icon: markerIcon,
                        visible: true,
                    });
                    serviceMarker.addListener('click', () => {
                        if (prevWindow) {
                            prevWindow.close();
                        }
                        prevWindow = infowindow;

                        infowindow.open(map, serviceMarker);
                    });
                    allServices[service._id] = serviceMarker;
                });
        });
    }, []);

    const onAutoCompleteLoad = useCallback(autocompleteLoaded => {
        autocomplete.current = autocompleteLoaded;
    }, []);

    const getUserLocation = () => {
        navigator.geolocation?.getCurrentPosition(position => {
            setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        });
    };

    const onSearchAddressChanged = () => {
        setCenter(autocomplete.current?.getPlace().geometry?.location);
    };

    useEffect(() => {
        if (props.selectedService) {
            setCenter(props.selectedService.location);
            new window.google.maps.event.trigger(
                allServices[props.selectedService._id],
                'click'
            );
        }
        marker.current?.setPosition(center);
        marker.current?.setVisible(false);
    }, [center, props.selectedService]);

    return (
        <div className={classes.root}>
            {isLoaded && (
                <GoogleMap
                    mapContainerClassName={classes.mapContainer}
                    center={center}
                    zoom={12}
                    mapTypeControl={false}
                    onLoad={onMapLoad}
                    options={mapOptions}>
                    <div className={classes.addressContainer}>
                        <Autocomplete
                            options={{
                                ...autocompleteOptions,
                                origin: center,
                            }}
                            onPlaceChanged={onSearchAddressChanged}
                            onLoad={onAutoCompleteLoad}
                            className={classes.autocomplete}>
                            <TextField
                                className={classes.textField}
                                id="search-address"
                            />
                        </Autocomplete>
                    </div>
                    <IconButton
                        className={classes.button}
                        onClick={getUserLocation}>
                        <MyLocationIcon className={classes.icon} />
                    </IconButton>
                </GoogleMap>
            )}
        </div>
    );
};

export default Map;
