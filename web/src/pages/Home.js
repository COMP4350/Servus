import React from 'react';
import Map from '../components/map/Map';
import { makeStyles } from '@material-ui/core/styles';
import ServiceList from '../components/ServiceList';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        [theme.breakpoints.up('lg')]: {
            'flex-direction': 'row',
        },
        [theme.breakpoints.down('xs')]: {
            'flex-direction': 'column-reverse',
        },
        width: '100%',
        height: '91%',
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
