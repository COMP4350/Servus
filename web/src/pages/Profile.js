import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { Settings } from '@material-ui/icons/';
import ImageBoard from '../components/ImageBoard';
import UserInfo from '../components/UserInfo';

const useStyles = makeStyles(theme => ({
    root: {
        height: '90%',
        width: '100%',
        display: 'flex',
        [theme.breakpoints.up('lg')]: {
            'flex-direction': 'row',
        },
        [theme.breakpoints.down('xs')]: {
            'flex-direction': 'column',
        },
    },
    accountBtn: {
        position: 'absolute',
        top: 50,
        right: 0,
        '&:hover': {},
    },
    settingsIcon: {
        height: '75px',
        width: '75px',
        color: 'white',
    },
}));

const Profile = () => {
    const classes = useStyles();
    const [cookies] = useCookies(['username']);
    const history = useHistory();
    let { targetUsername } = useParams();
    const [user, setUser] = useState({});
    const toAccount = () => {
        history.push('/account');
    };
    const displaySettings = () => {
        return (
            <IconButton
                className={classes.accountBtn}
                onClick={() => {
                    toAccount();
                }}>
                <Settings className={classes.settingsIcon} />
            </IconButton>
        );
    };

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                let res = await axios.get(`/user/${targetUsername}`);
                setUser(res.data.result);
            } catch {
                history.push('/');
            }
        };
        if (targetUsername) getUserInfo();
    }, [targetUsername]);

    return (
        <div className={classes.root}>
            <UserInfo user={user} />
            <ImageBoard username={targetUsername}></ImageBoard>

            {cookies.username && cookies.username === targetUsername
                ? displaySettings()
                : null}
        </div>
    );
};

export default Profile;
