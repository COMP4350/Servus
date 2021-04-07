import React, { useEffect, useState } from 'react';
import Map from '../components/map/Map';
import { makeStyles } from '@material-ui/core/styles';
import ServiceList from '../components/ServiceList';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';

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
    const [cookies] = useCookies();
    const history = useHistory();
    const [selected_service, setService] = useState();
    useEffect(() => {
        if (!cookies.username) history.push('/login');
    }, []);
    return (
        <div className={classes.container}>
            <ServiceList setSelectedService={service => setService(service)} />
            <Map selected_service={selected_service} />
        </div>
    );
};

export default Home;
