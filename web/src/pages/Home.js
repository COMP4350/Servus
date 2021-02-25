import React from 'react';
import Map from '../components/map/Map';
import { makeStyles } from '@material-ui/core/styles';
import ServiceList from '../components/ServiceList';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        width: '100%',
        height: '100%',
    },
}));

const Home = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <ServiceList />
            <Map />
        </div>
    );
};

export default Home;
