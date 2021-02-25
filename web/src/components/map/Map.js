import axios from 'axios';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, IconButton } from '@material-ui/core';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import ReactDOM from 'react-dom';

import {
    Autocomplete,
    GoogleMap,
    useJsApiLoader,
} from '@react-google-maps/api';
import mapStyle from './mapStyle.json';
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
        backgroundColor: 'white',
    },
    addressContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2%',
        width: '100%',
    },
    mapContainer: {
        width: '100%',
        height: '90%',
        margin: 10,
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

const winnipeg = {
    lat: 49.8951,
    lng: -97.1384,
};

const mapLibraries = ['places'];

const defaultBounds = {
    north: winnipeg.lat + 1.0,
    south: winnipeg.lat - 1.0,
    east: winnipeg.lng + 1.0,
    west: winnipeg.lng - 1.0,
};

const autocompleteOptions = {
    bounds: defaultBounds,
    componentRestrictions: { country: 'ca' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    origin: winnipeg,
    strictBounds: true,
};

const mapOptions = {
    mapTypeControl: false,
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyle,
};

const Map = () => {
    const classes = useStyles();
    const [center, setCenter] = useState(winnipeg);

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
        axios
            .get(`${process.env.REACT_APP_API_HOST}/services/`)
            .then(response => {
                let services = response.data.result;
                services &&
                    services.map(service => {
                        var div = document.createElement('div');
                        //build the content string
                        const contentString = (
                            <ServiceWindow
                                service={service}
                                username={'zimbakor'}
                            />
                        );
                        ReactDOM.render(contentString, div);

                        const infowindow = new window.google.maps.InfoWindow({
                            content: div,
                        });

                        let serviceMarker = new window.google.maps.Marker({
                            map,
                            position: {
                                lat: service.location.lat,
                                lng: service.location.lng,
                            },
                            icon: ServiceIcon,
                            visible: true,
                        });
                        serviceMarker.addListener('click', () => {
                            infowindow.open(map, serviceMarker);
                        });
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
        marker.current?.setPosition(center);
        marker.current?.setVisible(true);
    }, [center]);
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
                            options={{ ...autocompleteOptions, origin: center }}
                            onPlaceChanged={onSearchAddressChanged}
                            onLoad={onAutoCompleteLoad}>
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
