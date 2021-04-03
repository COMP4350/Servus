import React, { useState } from 'react';
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
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        fontSize: '2em',
        color: 'white',
        textTransform: 'capitalize',
    },
    title: {
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
        },
        '&:hover': {
            cursor: 'pointer',
        },
        fontsize: '2em',
    },
    headerOptions: {
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-end',
    },
}));

const Header = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = pageURL => {
        props.history.push(pageURL);
        setAnchorEl(null);
    };

    const handleButtonClick = pageURL => {
        props.history.push(pageURL);
    };

    const menuItems = [
        {
            menuTitle: 'Home',
            pageURL: '/',
        },
        {
            menuTitle: 'Appointment',
            pageURL: '/appointment',
        },
        {
            menuTitle: 'Login',
            pageUrl: '/login',
        },
        {
            menuTitle: 'Services',
            pageUrl: '/services',
        },
    ];

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <div
                        className={classes.title}
                        onClick={() => handleButtonClick('/')}>
                        <Typography variant="h4">Servus</Typography>
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
                                <Typography variant="h4">
                                    Appointments
                                </Typography>
                            </Button>
                            <Button
                                className={classes.menuButton}
                                onClick={
                                    props.username
                                        ? () =>
                                              handleButtonClick(
                                                  `/profile/${props.username}`
                                              )
                                        : () => handleButtonClick('/login')
                                }>
                                <Typography variant="h4">
                                    {props.username ? props.username : 'Login'}
                                </Typography>
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
