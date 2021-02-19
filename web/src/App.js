import React from 'react';
import './index.css';
import Home from './Components/Home';
import Contact from './Components/Contact';
import About from './Components/About';
import Header from './Components/Header';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Appointment from './Components/Appointments';

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
                    path="/Appointment"
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
            </Switch>
        </div>
    );
}
