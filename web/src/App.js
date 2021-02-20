import React from 'react';
import './stylesheets/index.css';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import Header from './components/Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Appointment from './components/Appointments';

const App = () => {
    const classes = makeStyles({});
    return (
        <div className={classes.container}>
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route
                        exact
                        from="/"
                        render={props => <Home {...props} />}
                    />
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
            </BrowserRouter>
        </div>
    );
};

export default App;
