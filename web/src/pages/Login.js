import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import useForm from '../hooks/useForm';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        margin: '2%',
    },
    textField: {
        width: '50%',
        marginBottom: '3%',
    },
    button: {
        marginBottom: '3%',
        textTransform: 'capitalize',
    },
}));

const Login = props => {
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [formValid, setFormValid] = useState(false);
    const [loginForm, onFormChange] = useForm({
        username: '',
        password: '',
    });
    const validate = () => {
        let errors = {};
        if (!loginForm.username) {
            errors.username = 'username is required';
        }
        if (!loginForm.password) {
            errors.password = 'password is required';
        }
        setErrors(errors);
        setFormValid(
            Object.getOwnPropertyNames(errors).length == 0
        );
    };
    const login = async () => {
        if (formValid) {
            axios
                .post(
                    `${process.env.REACT_APP_API_HOST}/user/${loginForm.username}/login`,
                    {
                        password: loginForm.password,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(res => {
                    console.log(res.data.result.username);
                    props.setUsername(res.data.result.username);
                    history.push('/');
                })
                .catch(() => {
                    alert('User not found.');
                });
            return;
        }
    };

    useEffect(() => {
        login();
    }, [formValid]);

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
                error={errors.username}
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
                error={errors.password}
            />
            <Button
                className={classes.button}
                variant="contained"
                onClick={validate}>
                Login
            </Button>
            <Button
                className={classes.button}
                variant="contained"
                onClick={() => history.push('/signup')}>
                Sign up
            </Button>
        </div>
    );
};

export default Login;
