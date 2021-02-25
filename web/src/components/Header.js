import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: 'white',
    },
    title: {
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
        },
        '&:hover': {
            cursor: 'pointer',
        },
    },
    headerOptions: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-evenly',
    },
}));

const Header = ({ history }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const [username, setUsername] = useState();
    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = pageURL => {
        history.push(pageURL);
        setAnchorEl(null);
    };

    const handleButtonClick = pageURL => {
        history.push(pageURL);
    };

    useEffect(() => {
        if (cookies.username) setUsername(cookies.username);
    }, []);

    const menuItems = [
        {
            menuTitle: 'Home',
            pageURL: '/',
        },
        {
            menuTitle: 'Contact',
            pageURL: '/contact',
        },
        {
            menuTitle: 'About',
            pageURL: '/about',
        },
        {
            menuTitle: 'Appointment',
            pageURL: '/appointment',
        },
        {
            menuTitle: 'Login',
            pageUrl: '/login',
        },
    ];

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <div
                        className={classes.title}
                        onClick={() => handleButtonClick('/')}>
                        <h1>Servus</h1>
                    </div>
                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenu}>
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={() => setAnchorEl(null)}>
                                {menuItems.map((menuItem, i) => {
                                    const { menuTitle, pageURL } = menuItem;
                                    return (
                                        <MenuItem
                                            key={i}
                                            onClick={() =>
                                                handleMenuClick(pageURL)
                                            }>
                                            {menuTitle}
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                        </>
                    ) : (
                        <div className={classes.headerOptions}>
                            <Button
                                className={classes.menuButton}
                                onClick={() =>
                                    handleButtonClick('/appointment')
                                }>
                                Appointments
                            </Button>
                            <Button
                                className={classes.menuButton}
                                onClick={() => handleButtonClick('/contact')}>
                                Contact
                            </Button>
                            <Button
                                className={classes.menuButton}
                                onClick={() => handleButtonClick('/about')}>
                                About
                            </Button>
                            <Button
                                className={classes.menuButton}
                                onClick={() => handleButtonClick('/login')}>
                                {username ? username : 'LOGIN'}
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

Header.propTypes = {
    history: PropTypes.any,
    push: PropTypes.func,
};

export default withRouter(Header);
