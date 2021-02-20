import React from 'react';
import './index.css';
import Home from './Components/Home';
import Contact from './Components/Contact';
import About from './Components/About';
import Header from './Components/Header';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Appointment from './Components/Appointments';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

const useStyles = makeStyles({});

export default function App() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Header />
            <Switch>
                <Route exact from="/" render={props => <Home {...props} />} />
                <Route
                    exact
                    path="/appointment"
                    render={props => <Appointment {...props} />}
                />
                <Route
                    exact
                    path="/contact"
                    render={props => <Contact {...props} />}
                />
                <Route
                    exact
                    path="/about"
                    render={props => <About {...props} />}
                />
                <Route
                    exact
                    path="/login"
                    render={props => <Login {...props} />}
                />
                <Route
                    exact
                    path="/signup"
                    render={props => <SignUp {...props} />}
                />
            </Switch>
        </div>
    );
}
