import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: '10%'
  },
  textField : {
    width: '50%',
    marginBottom: '3%'
  },
  button : {
    marginBottom: '3%'
  }
}));
const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const validate = () => {
    history.push('/home');
    // validate login
  };
  const createAccount = () => {
    // call the api to create account
  };

  return ( <div className={classes.root}>
<h2>Create Account</h2>
<TextField className={classes.textField}
        id="outlined-basic"
        label="First Name"
      />
      <TextField className={classes.textField}
        id="outlined-basic"
        label="Last Name"
      />
        <TextField className={classes.textField}
        id="outlined-basic"
        label="Username"
      />
      <TextField className={classes.textField}
        id="outlined-password-input"
        label="password"
        type="Password"
        autoComplete="current-password"
      />
      <TextField className={classes.textField}
        id="outlined-password-input"
        label="Confirm Password"
        type="password"
        autoComplete="current-password"
      />
      <Button className={classes.button}
        variant="contained"
        onClick={validate}>
        CREATE ACCOUNT
      </Button>
    </div>)};

    export default SignUp;