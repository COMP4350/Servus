import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons/';
import { Button, Typography, List, ListItem, Modal } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import AddService from '../components/AddService';
import ServiceCard from '../components/ServiceCard';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('xs')]: {
            minWidth: '384px',
            width: '384px',
            height: '100%',
        },
        'background-color': theme.background.dark,
        'overflow-y': 'scroll',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
        },
    },
    userInfo: {
        height: '100%',
        width: '20%',
        background: 'grey',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    userIconContainer: {
        display: 'flex',
        justifyContent: 'center',
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
        color: 'white',
    },
    rootList: {
        padding: '8px',
        width: '100%',
        height: 'auto',
        'overflow-x': 'hidden',
    },
    buttonContainer: {
        display: 'flex',
        marginTop: '10px',
        justifyContent: 'center',
        width: '100%',
    },
    button: {
        marginTop: 10,
        textTransform: 'capitalize',
    },
    bio: {
        width: '100%',
        'text-align': 'center',
        padding: '0',
        margin: '0',
    },
    modal: {
        width: '50%',
        height: '50%',
        position: 'absolute',
        left: '25%',
        top: '25%',
    },
}));

const listItemClass = makeStyles(theme => ({
    root: {
        '& p': {
            color: '#545454',
        },
        padding: '0',
        'padding-top': '4px',
        'padding-bottom': '4px',
        height: 'auto',
        width: 'auto',
    },
    selected: {
        '& p': {
            color: 'white',
        },
    },
    divider: {
        'border-color': theme.background.main,
    },
}));

const ServiceList = props => {
    const classes = useStyles();
    const [services, setServiceList] = useState([]);
    const [addingService, setAddingService] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [cookies] = useCookies(['username']);
    const style = listItemClass();

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

    const handleListItemClick = (e, index) => {
        console.log(e);
        console.log(index);
        setSelectedIndex(index);
    };
    const handleClose = () => {
        setAddingService(false);
    };

    return (
        <div className={classes.serviceList}>
            <List className={classes.rootList}>
                {services
                    ? services.map((service, index) => {
                          return (
                              <ListItem
                                  key={index}
                                  classes={style}
                                  onClick={e => handleListItemClick(e, index)}
                                  selected={selectedIndex == index}
                                  divider={true}>
                                  <ServiceCard
                                      service={service}
                                      index={index}
                                      className={classes.serviceCard}
                                      selected={selectedIndex == index}
                                  />
                              </ListItem>
                          );
                      })
                    : null}
            </List>
            {cookies.username && cookies.username === props.username ? (
                <div>
                    <Modal open={addingService} onClose={handleClose}>
                        <div className={classes.modal}>
                            <AddService addedService={addedService} />
                        </div>
                    </Modal>
                    <div className={classes.buttonContainer}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            onClick={() => setAddingService(true)}>
                            Add Service
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

const UserInfo = ({ user }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {user ? (
                <div className={classes.userContainer}>
                    <div className={classes.userDesc}>
                        <AccountCircle className={classes.userIcon} />
                        <Typography className={classes.username}>{`@${user.username}`}</Typography>
                        <div className={classes.bioContainer}>
                            <Typography
                                className={classes.bio}
                                color="textPrimary">
                                {user.bio}
                            </Typography>
                        </div>
                        <Typography>{`Service List:`}</Typography>
                    </div>
                    <ServiceList username={user.username} />
                </div>
            ) : (
                <Typography>User Does Not Exist</Typography>
            )}
        </div>
    );
};

export default UserInfo;
