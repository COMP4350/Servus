import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '10%'
  },
  textField : {
    width: '50%',
    marginBottom: '3%'
  },
  button : {
    marginBottom: '3%'
  }
}));

const mapStyle = {
  width: '400px',
  height: '400px'
};

const winnipeg = {
  latitude: 49.8951,
  longitude: 97.1384
};

const Location = () => {
  console.log(process.env.GOOGLE_MAPS_KEY);
  const classes = useStyles();
  const [center, setCenter] = useState();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(map => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setCenter(navigator.geolocation.getCurrentPosition(position => center = position));
    } else {
      center = winnipeg;
    }
  }, []);
  return (
    <div className={classes.root}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapStyle}
          center = {center}
          zoom = {10}
          onLoad = {onLoad}/>
      )}
      <TextField className={classes.textField}
        id="outlined-basic"
        label="Location"
      />
    </div>
      
  );
};

export default Location;