import React, { useState, useEffect } from 'react';
import './stylesheets/index.css';
import Home from './pages/Home';
import Header from './components/Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Appointment from './pages/Appointments';
import Account from './pages/Account';
import Profile from './pages/Profile';
import dotenv from 'dotenv';
import { useCookies } from 'react-cookie';

dotenv.config();

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        height: '100%',
    },
}));

const App = () => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [username, setUsername] = useState();

    useEffect(() => {
        if (cookies.username) setUsername(cookies.username);
    }, []);
    return (
        <div className={classes.container}>
            <BrowserRouter>
                <Header username={username} />
                <Switch>
                    <Route
                        exact
                        from="/"
                        render={props => <Home {...props} />}
                    />
                    <Route
                        exact
                        path="/appointment"
                        render={props => <Appointment {...props} />}
                    />
                    <Route
                        exact
                        path="/login"
                        render={props => (
                            <Login {...props} setUsername={setUsername} />
                        )}
                    />
                    <Route
                        exact
                        path="/signup"
                        render={props => <SignUp {...props} />}
                    />
                    <Route
                        exact
                        path="/account"
                        render={props => (
                            <Account {...props} setUsername={setUsername} />
                        )}
                    />
                    <Route
                        exact
                        path={`/profile/:targetUsername`}
                        render={props => (
                            <Profile {...props} setUsername={setUsername} />
                        )}
                    />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;
