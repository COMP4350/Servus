import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import useForm from '../hooks/useForm';
import axios from 'axios';

const useStyles = makeStyles(() => ({
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

const SignUp = () => {
    const classes = useStyles();
    const history = useHistory();
    const [errors, setErrors] = useState({});
    const [formValid, setFormValid] = useState();
    const [signUpForm, onFormChange] = useForm({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const validate = () => {
        let errors = {};
        if (!signUpForm.firstName) {
            errors.username = 'first name is required';
        }
        if (!signUpForm.lastName) {
            errors.username = 'last name is required';
        }
        if (!signUpForm.username) {
            errors.username = 'username is required';
        }
        if (!signUpForm.password) {
            errors.password = 'password is required';
        }
        if (!signUpForm.confirmPassword) {
            errors.confirmPassword = 'confirm password is required';
        } else if (signUpForm.confirmPassword !== signUpForm.password) {
            errors.confirmPassword = 'passwords must match';
        }
        setErrors(errors);
        setFormValid(Object.getOwnPropertyNames(errors).length == 0);
    };
    const createAccount = async () => {
        if (formValid) {
            axios
                .post(
                    `/user/${signUpForm.username}`,
                    {
                        password: signUpForm.password,
                        firstName: signUpForm.firstName,
                        lastName: signUpForm.lastName,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    axios.post(
                        `/user/${signUpForm.username}/login`,
                        {
                            password: signUpForm.password,
                        },
                        {
                            withCredentials: true,
                        }
                    );
                    history.push('/');
                })
                .catch(err => {
                    if (err.response.status == 422)
                        alert('username already exists');
                    else alert(err);
                    setFormValid(false);
                });
            return;
        }
    };
    useEffect(() => {
        createAccount();
    }, [formValid]);

    return (
        <div className={classes.root}>
            <h2>Create Account</h2>
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="First Name"
                name="firstName"
                value={signUpForm.firstName}
                onChange={onFormChange}
                error={errors.firstName}
                helperText={errors.firstName}
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Last Name"
                name="lastName"
                value={signUpForm.lastName}
                onChange={onFormChange}
                error={errors.lastName}
                helperText={errors.lastName}
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Username"
                name="username"
                value={signUpForm.username}
                onChange={onFormChange}
                error={errors.username}
                helperText={errors.username}
            />
            <TextField
                className={classes.textField}
                id="outlined-password-input"
                label="password"
                type="Password"
                autoComplete="current-password"
                name="password"
                value={signUpForm.password}
                onChange={onFormChange}
                error={errors.password}
                helperText={errors.password}
            />
            <TextField
                className={classes.textField}
                id="outlined-password-input"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={signUpForm.confirmPassword}
                onChange={onFormChange}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword}
            />
            <Button
                className={classes.button}
                variant="contained"
                onClick={validate}>
                CREATE ACCOUNT
            </Button>
        </div>
    );
};

export default SignUp;
