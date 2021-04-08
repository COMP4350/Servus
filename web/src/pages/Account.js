import React, { useEffect, useState } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import {
    Button,
    TextField,
    IconButton,
    ThemeProvider,
    Typography,
    Input,
} from '@material-ui/core';
import useForm from '../hooks/useForm';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import ProfilePicture from '../components/ProfilePicture';
import { useHistory } from 'react-router';
import { ArrowBack } from '@material-ui/icons/';

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
    title: {
        color: 'white',
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
    bio: {
        height: '100px',
        width: '50%',
        marginBottom: '20px',
    },
    pic: {
        color: 'white',
        width: 96,
        height: 96,
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
        bio: '',
    });
    const getUserInfo = () => {
        axios
            .get(`/user/${cookies.username}`)
            .then(res => {
                setForm({
                    username: res.data.result.username,
                    firstName: res.data.result.firstName,
                    lastName: res.data.result.lastName,
                    bio: res.data.result.bio,
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
        if (form.bio.length > 250) {
            errors.bio = 'bio must be under 250 characters';
        }
        setErrors(errors);
        setFormValid(Object.getOwnPropertyNames(errors).length == 0);
    };
    const logout = () => {
        removeCookie('username');
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
                        bio: form.bio,
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
        history.push(`/profile/${cookies.username}`);
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
    const uploadImage = e => {
        let imageFormObj = new FormData();
        imageFormObj.append('imageName', 'multer-image-' + Date.now());
        imageFormObj.append('imageData', e.target.files[0]);
        imageFormObj.append('ownerUsername', cookies.username);
        imageFormObj.append('profilePicture', true);

        // stores a readable instance of the image being uploaded using multer
        axios
            .post(`/images/upload`, imageFormObj)
            .then(() => {})
            .catch(err => {
                alert('Error while uploading image' + err);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <Typography variant="h2" className={classes.title}>
                    Account Details
                </Typography>
                <ProfilePicture username={cookies.username} />
                <Input type="file" onChange={e => uploadImage(e, 'multer')} />
                <TextField
                    className={classes.textField}
                    id="outlined-basic"
                    label="First Name"
                    name="firstName"
                    value={form.firstName}
                    onChange={onFormChange}
                    error={errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    className={classes.textField}
                    id="outlined-basic"
                    label="Last Name"
                    name="lastName"
                    value={form.lastName}
                    onChange={onFormChange}
                    error={errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    className={classes.textField}
                    id="outlined-basic"
                    label="Username"
                    name="username"
                    value={form.username}
                    onChange={onFormChange}
                    error={errors.username}
                    helperText={errors.username}
                />
                <TextField
                    className={classes.bio}
                    id="outlined-basic"
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={onFormChange}
                    multiline
                    rowsMax={4}
                    error={errors.bio}
                    helperText={errors.bio}
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
                            helperText={passwordErrors.password}
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
                            helperText={passwordErrors.confirmPassword}
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
                    <ArrowBack className={classes.arrowIcon} />
                </IconButton>
            </div>
        </ThemeProvider>
    );
};

export default Account;
