import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    ThemeProvider,
    Typography,
} from '@material-ui/core';
import axios from 'axios';
import useForm from '../hooks/useForm';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#647AA3',
        },
        secondary: {
            main: '#EC5732',
        },
        default: {
            main: '#FFF2EB',
        },
    },
    background: {
        dark: '#151515',
        main: '#272727',
    },
    typography: {
        fontFamily: ['Roboto'],
    },
});

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
    title: {
        color: 'white',
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
        setFormValid(Object.getOwnPropertyNames(errors).length == 0);
    };
    const login = async () => {
        if (formValid) {
            axios
                .post(
                    `/user/${loginForm.username}/login`,
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
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <Typography variant="h2" className={classes.title}>
                    Login
                </Typography>
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
        </ThemeProvider>
    );
};

export default Login;
