import React, { useEffect, useState } from 'react';
import Map from '../components/map/Map';
import { makeStyles } from '@material-ui/core/styles';
import ServiceList from '../components/ServiceList';
import { useCookies } from 'react-cookie';
import { useHistory, withRouter } from 'react-router-dom';

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
    mapContainer: {
        width: '100%',
        height: '100%',
    },
}));

const Home = () => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const history = useHistory();
    const [selectedService, setService] = useState();
    useEffect(() => {
        if (!cookies.username) history.push('/login');
    }, []);
    return (
        <div className={classes.container}>
            <ServiceList setSelectedService={service => setService(service)} />
            <div className={classes.mapContainer} data-cy="map">
                <Map selectedService={selectedService} history={history} />
            </div>
        </div>
    );
};

export default withRouter(Home);
