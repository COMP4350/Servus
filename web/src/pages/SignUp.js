import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
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
const SignUp = () => {
    const classes = useStyles();
    const history = useHistory();
    const [signUpForm, onFormChange] = useForm({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const validate = () => {
        // validate login
    };
    const createAccount = () => {
        history.push('/home');
    };

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
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Last Name"
                name="lastName"
                value={signUpForm.lastName}
                onChange={onFormChange}
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Username"
                name="username"
                value={signUpForm.username}
                onChange={onFormChange}
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
            />
            <TextField
                className={classes.textField}
                id="outlined-password-input"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={signUpForm.confirmPassword}
                onChange={onFormChange}
            />
            <Button
                className={classes.button}
                variant="contained"
                onClick={createAccount}>
                CREATE ACCOUNT
            </Button>
        </div>
    );
};

export default SignUp;
