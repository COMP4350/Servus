import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons/';
import { Card, Typography } from '@material-ui/core';
import axios from 'axios';

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
    },
}));

const ServiceList = props => {
    const classes = useStyles();
    let [services, setServiceList] = useState([]);
    const getServices = async () => {
        const response = await axios.get(`/user/${props.username}/services`);
        setServiceList(response.data.result);
    };
    useEffect(() => {
        getServices();
    }, [props]);
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
                                  variant="p"
                                  className={classes.details}>
                                  {`Info: ${service.description}`}
                              </Typography>
                          </Card>
                      );
                  })
                : null}
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
