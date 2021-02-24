import React from 'react';
import Map from './Map';
import { makeStyles } from '@material-ui/core/styles';

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
        </div>
    );
};

export default Home;
