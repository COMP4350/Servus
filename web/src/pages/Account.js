import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, IconButton } from '@material-ui/core';
import useForm from '../hooks/useForm';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

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
    passwordTextField: {
        marginRight: '10px',
    },
    button: {
        textTransform: 'capitalize',
        marginRight: '10px',
    },
    buttonContainer: {
        display: 'flex',
        marginTop: '10px',
    },
    passwordContainer: {
        display: 'flex',
        marginBottom: '3%',
        alignItems: 'center',
    },
    accountBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        '&:hover': {},
    },
    arrowIcon: {
        height: '75px',
        width: '75px',
    },
}));

const Account = props => {
    const classes = useStyles();
    const history = useHistory();
    const [cookies, removeCookie] = useCookies(['username']);
    const [errors, setErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [formValid, setFormValid] = useState();
    const [passwordValid, setPasswordValid] = useState();
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [form, onFormChange, setForm] = useForm({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
    });
    const getUserInfo = () => {
        axios
            .get(`/user/${cookies.username}`)
            .then(res => {
                setForm({
                    username: res.data.result.username,
                    firstName: res.data.result.firstName,
                    lastName: res.data.result.lastName,
                });
            })
            .catch(err => {
                alert('could not update password' + err);
            });
    };
    const validateInfo = () => {
        let errors = {};
        if (!form.firstName) {
            errors.username = 'first name is required';
        }
        if (!form.lastName) {
            errors.username = 'last name is required';
        }
        if (!form.username) {
            errors.username = 'username is required';
        }
        setErrors(errors);
        setFormValid(Object.getOwnPropertyNames(errors).length == 0);
    };
    const logout = () => {
        removeCookie('username', '');
        props.setUsername('');
        history.push('/login');
    };
    const validatePassword = () => {
        let errors = {};
        if (!form.password) {
            errors.password = 'password is required';
        }
        if (!form.confirmPassword) {
            errors.confirmPassword = 'last name is required';
        } else if (form.password !== form.confirmPassword) {
            errors.confirmPassword = 'passwords must match';
        }
        setPasswordErrors(errors);
        setPasswordValid(
            Object.getOwnPropertyNames(errors).length == 0 ? true : false
        );
    };
    const updatePassword = async () => {
        if (passwordValid) {
            axios
                .put(`/user/${form.username}`, {
                    password: form.password,
                })
                .then(() => {
                    alert('Password updated successfully');
                    setUpdatingPassword(false);
                })
                .catch(err => {
                    alert('could not update password' + err);
                });
            setPasswordValid(false);
        }
    };
    const updateInfo = async () => {
        if (formValid) {
            axios
                .put(
                    `/user/${form.username}`,
                    {
                        password: form.password,
                        firstName: form.firstName,
                        lastName: form.lastName,
                    },
                    {
                        withCredentials: true,
                    }
                )
                .then(() => {
                    alert('Info updated successfully');
                    props.setUsername(form.username);
                })
                .catch(err => {
                    alert(err);
                    setFormValid(false);
                });
            setFormValid(false);

            return;
        }
    };
    const toProfile = () => {
        history.push('/profile');
    };
    useEffect(() => {
        updateInfo();
    }, [formValid]);

    useEffect(() => {
        updatePassword();
    }, [passwordValid]);

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className={classes.root}>
            <h2>Account Details</h2>
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={onFormChange}
                error={errors.firstName}
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={onFormChange}
                error={errors.lastName}
            />
            <TextField
                className={classes.textField}
                id="outlined-basic"
                label="Username"
                name="username"
                value={form.username}
                onChange={onFormChange}
                error={errors.username}
            />
            {updatingPassword ? (
                <div className={classes.passwordContainer}>
                    <TextField
                        className={classes.passwordTextField}
                        id="outlined-password-input"
                        label="password"
                        type="Password"
                        autoComplete="current-password"
                        name="password"
                        value={form.password}
                        onChange={onFormChange}
                        error={passwordErrors.password}
                    />
                    <TextField
                        className={classes.passwordTextField}
                        id="outlined-password-input"
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={onFormChange}
                        error={passwordErrors.confirmPassword}
                    />
                    <Button
                        className={classes.button}
                        onClick={validatePassword}
                        variant="contained">
                        Update Password
                    </Button>
                </div>
            ) : (
                <Button
                    className={classes.button}
                    onClick={() => setUpdatingPassword(true)}
                    variant="contained">
                    Update Password
                </Button>
            )}

            <div className={classes.buttonContainer}>
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={validateInfo}>
                    Update Info
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={logout}>
                    Logout
                </Button>
            </div>
            <IconButton
                className={classes.accountBtn}
                onClick={() => {
                    toProfile();
                }}>
                <ArrowBackIcon className={classes.arrowIcon} />
            </IconButton>
        </div>
    );
};

export default Account;
