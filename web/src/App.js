import React from 'react';
import './stylesheets/index.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Header from './components/Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Appointment from './pages/Appointments';
import dotenv from 'dotenv';

dotenv.config();

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        height: '100%',
    },
}));

const App = () => {
    console.log(process.env);
    const classes = useStyles();
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
