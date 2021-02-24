import React from 'react';
import Map from '../components/map/Map';
import { makeStyles } from '@material-ui/core/styles';
import ServiceList from '../components/ServiceList';

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        height: '100%',
    },
}));

const Home = () => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Map />
            <ServiceList />
        </div>
    );
};

export default Home;
