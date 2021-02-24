import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import useForm from '../hooks/useForm';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        margin: '10%',
    },
    textField: {
        width: '50%',
        marginBottom: '3%',
    },
    button: {
        marginBottom: '3%',
    },
}));

const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const [loginForm, onFormChange] = useForm({
        username: '',
        password: '',
    });
    const validateLogin = async () => {
        history.push('/home');
        axios
            .post('http://localhost:5000/login', {
                username: loginForm.username,
                password: loginForm.password,
            })
            .then(response => {
                console.log(response);
            });
    };

    return (
        <div className={classes.root}>
            <h2>Login</h2>
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="username"
                name="username"
                value={loginForm.username}
                onChange={onFormChange}
            />
            <TextField
                className={classes.textField}
                id="outlined-password-input"
                label="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={onFormChange}
            />
            <Button
                className={classes.button}
                variant="contained"
                onClick={validateLogin}>
                LOGIN
            </Button>
            <Button
                className={classes.button}
                variant="contained"
                onClick={() => history.push('/signup')}>
                SIGN UP
            </Button>
        </div>
    );
};

export default Login;
