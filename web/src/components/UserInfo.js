import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons/';
import { Button, Card, Typography } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import AddService from '../components/AddService';

const useStyles = makeStyles(() => ({
    userInfo: {
        height: '100%',
        width: '20%',
        background: 'grey',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    userIcon: {
        height: '75px',
        width: '75px',
        margin: '0',
        padding: '0',
    },
    username: {
        width: '100%',
        'text-align': 'center',
        padding: '0',
        margin: '0',
    },
    title: {
        fontSize: '1.3em',
    },
    cardView: {
        width: '100%',
    },
    userDesc: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        flexDirection: 'column',
    },
    serviceList: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        marginTop: 10,
    },
    bio: {
        width: '100%',
        'text-align': 'center',
        padding: '0',
        margin: '0',
    },
    bioContainer: {
        backgroundColor: 'white',
        borderRadius: '4px',
        width: '95%',
    },
}));

const ServiceList = props => {
    const classes = useStyles();
    const [services, setServiceList] = useState([]);
    const [addingService, setAddingService] = useState(false);
    const [cookies] = useCookies(['username']);

    const getServices = async () => {
        const response = await axios.get(`/user/${props.username}/services`);
        setServiceList(response.data.result);
    };

    useEffect(() => {
        getServices();
    }, [props]);

    const addedService = () => {
        getServices();
        setAddingService(false);
    };

    return (
        <div className={classes.serviceList}>
            {services
                ? services.map((service, index) => {
                      return (
                          <Card
                              variant="outlined"
                              className={classes.cardView}
                              key={index}>
                              <Typography
                                  variant="h5"
                                  className={classes.title}>
                                  {service.name}
                              </Typography>
                              <Typography
                                  variant="caption"
                                  className={classes.details}>
                                  {`Info: ${service.description}`}
                              </Typography>
                          </Card>
                      );
                  })
                : null}
            {cookies.username && cookies.username === props.username ? (
                addingService ? (
                    <AddService addedService={addedService} />
                ) : (
                    <Button
                        className={classes.button}
                        variant="contained"
                        onClick={() => setAddingService(true)}>
                        Add Service
                    </Button>
                )
            ) : null}
        </div>
    );
};

const UserInfo = ({ user }) => {
    const classes = useStyles();

    const displayUser = user => {
        console.log(user);

        return (
            <div className={classes.userDesc}>
                <Typography
                    className={classes.username}
                    color="textPrimary">{`@${user.username}`}</Typography>
                <div className={classes.bioContainer}>
                    <Typography className={classes.bio} color="textPrimary">
                        {user.bio}
                    </Typography>
                </div>

                <Typography color="textSecondary">{`Service List:`}</Typography>
                <ServiceList username={user.username} />
            </div>
        );
    };
    return (
        <div className={classes.userInfo}>
            <AccountCircle className={classes.userIcon} />
            {user ? displayUser(user) : null}
        </div>
    );
};

export default UserInfo;
