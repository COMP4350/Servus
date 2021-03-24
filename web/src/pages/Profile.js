import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(() => ({
    root: {
        height: '90%',
        width: '100%',
    },
    accountBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        '&:hover': {},
    },
    settingsIcon: {
        height: '50px',
        width: '50px',
    },
}));

const Profile = () => {
    const classes = useStyles();
    const [cookies] = useCookies(['username']);
    const history = useHistory();

    const [user, setUser] = useState({});
    console.log(user);
    const toAccount = () => {
        history.push('/account');
    };

    useEffect(() => {
        const getUserInfo = async () => {
            let res = await axios.get(`/user/${cookies.username}`);
            setUser(res.data.result);
        };
        if (cookies.username) getUserInfo();
        else history.push('/login');
    }, []);

    return (
        <div className={classes.root}>
            <IconButton
                className={classes.accountBtn}
                onClick={() => {
                    toAccount();
                }}>
                <SettingsIcon className={classes.settingsIcon} />
            </IconButton>
        </div>
    );
};

export default Profile;
