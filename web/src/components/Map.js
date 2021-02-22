import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
} from '@material-ui/core';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        margin: '10%',
    },
    textField: {
        width: '50%',
        marginBottom: '3%',
    },
    button: {
        marginBottom: '3%',
    },
}));

const mapStyle = {
    width: '400px',
    height: '400px',
};

const winnipeg = {
    lat: 49.8951,
    lng: -97.1384,
};

const Location = () => {
    const classes = useStyles();
    const [center, setCenter] = useState();
    const [address, setAddress] = useState();
    const [userLocation, setUserLocation] = useState(true);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    });
    let geocoder;

    const [map, setMap] = useState(null);
    const geocode = coords => {
        if (geocoder && coords) {
            geocoder.geocode({ location: coords }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        setAddress(results[0].formatted_address);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
    };
    const onLoad = useCallback(map => {
        const bounds = new window.google.maps.LatLngBounds();
        geocoder = new window.google.maps.Geocoder();
        getUserLocation();
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    useEffect(() => {
        geocode(center);
    }, [center]);

    const getUserLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            setCenter(winnipeg);
        }
    };
    const toggleLocation = () => {
        setUserLocation(!userLocation);
        if (userLocation) {
            getUserLocation();
        }
    };

    return (
        <div className={classes.root}>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={mapStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                />
            )}
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Location"
                value={address}
            />
            <FormControlLabel
                label="Use my location"
                control={
                    <Checkbox
                        checked={userLocation}
                        onChange={toggleLocation}
                    />
                }
            />
        </div>
    );
};

export default Location;
