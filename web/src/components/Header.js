import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import CompanyTitle from '../images/servus_text.svg';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        'background-color': '#FFF2EB',
    },
    title: {
        [theme.breakpoints.down('xs')]: {
            flexGrow: 1,
        },
    },
    logo: {
        height: '50px',
        '&:hover': {
            cursor: 'pointer',
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: '#272727',
        fontFamily: 'Times New Roman, serif',
    },
    mobile: {
        marginRight: theme.spacing(2),
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
            menuTitle: 'Appointments',
            pageURL: '/appointment',
        },
        {
            menuTitle: `${props.username}`,
            pageURL: `/profile/${props.username}`,
        },
    ];

    return (
        <div className={classes.root} position="static">
            <Toolbar>
                <div className={classes.title}>
                    <img
                        className={classes.logo}
                        onClick={() => handleButtonClick('/')}
                        src={CompanyTitle}
                        height="50"
                    />
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
                            className={classes.mobile}
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
                            onClick={() => handleButtonClick('/appointment')}>
                            <Typography variant="h4">Appointments</Typography>
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
        </div>
    );
};

Header.propTypes = {
    history: PropTypes.any,
    push: PropTypes.func,
};

export default withRouter(Header);
