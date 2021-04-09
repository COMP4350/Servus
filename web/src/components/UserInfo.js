import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Typography,
    List,
    ListItem,
    Modal,
    Paper,
} from '@material-ui/core';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import AddService from '../components/AddService';
import ServiceCard from '../components/ServiceCard';
import ProfilePicture from './ProfilePicture';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('xs')]: {
            minWidth: '384px',
            width: '384px',
            height: '100%',
        },
        'background-color': theme.background.dark,
        'overflow-y': 'scroll',
        'overflow-x': 'hidden',
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
        width: '90%',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        flexDirection: 'column',
        color: 'black',
        backgroundColor: '#FFF2EB',
        marginTop: '20px',
        marginBottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 8,
        'word-wrap': 'break-word',
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
        height: '80%',
        margin: 'auto auto',
        overflow: 'hidden',
    },
    servicesTitle: {
        marginLeft: '10px',
        color: 'white',
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
                                      bookable={
                                          cookies.username &&
                                          cookies.username !== props.username
                                      }
                                      service={service}
                                      index={index}
                                      className={classes.serviceCard}
                                      selected={selectedIndex == index}
                                      expand={true}
                                  />
                              </ListItem>
                          );
                      })
                    : null}
            </List>
            {cookies.username && cookies.username === props.username ? (
                <div>
                    <Modal
                        className={classes.modal}
                        open={addingService}
                        onClose={handleClose}>
                        <AddService addedService={addedService} />
                    </Modal>
                    <div 
                        className={classes.buttonContainer} 
                        data-cy='add_new_service_div'>
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

    useEffect(() => {}, [user]);
    return (
        <div className={classes.root}>
            {user ? (
                <div className={classes.userContainer}>
                    <Paper elevation={8} className={classes.userDesc}>
                        <ProfilePicture username={user.username} />
                        <Typography
                            className={
                                classes.username
                            }>{`@${user.username}`}</Typography>

                        <Typography className={classes.bio} color="textPrimary">
                            {user.bio}
                        </Typography>
                    </Paper>
                    <div className={classes.servicesTitle}>
                        <Typography>{`My Services:`}</Typography>
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
