import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    makeStyles,
    InputBase,
    Divider,
    IconButton,
    List,
    ListItem,
} from '@material-ui/core';
import { Menu, Search } from '@material-ui/icons/';

// import useForm from '../hooks/useForm';

import ServiceCard from './ServiceCard';

const useStyles = makeStyles(() => ({
    rootPanel: {
        minWidth: '384px',
        width: '384px',
        height: '100%',
        'background-color': '#151515',
        'overflow-y': 'hidden',
    },
    rootList: {
        padding: '8px',
        width: 'auto',
        height: 'auto',
        overflow: 'scroll',
        'overflow-x': 'hidden',
    },
    searchBar: {
        margin: '4%',
        padding: '0',
        width: '92%',
        height: '40px',
        'background-color': '#272727',
        'border-radius': '12px',
    },
    searchIcon: {
        cursor: 'pointer',
        color: 'white',
    },
    input: {
        width: '75%',
        flex: 1,
        color: 'white',
    },
    iconButton: {
        padding: 10,
        color: 'white',
    },
    divider: {
        height: 28,
        margin: 4,
        color: 'white',
    },
    bullet: {
        'padding-left': '5px',
        'padding-right': '5px',
        color: '#ec5732',
    },
}));

const listItemClass = makeStyles(() => ({
    root: {
        '& h2': {
            color: '#545454',
        },
        padding: '0',
        height: '50px',
    },
    selected: {
        '& h2': {
            color: 'white',
        },
    },
    divider: {
        'border-color': '#272727',
    },
}));

const ServiceList = () => {
    const [services, setServices] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);
    // const [searchForm, onSearchFormChange] = useForm({ search: '' });
    const classes = useStyles();
    const style = listItemClass();
    const getServices = async () => {
        try {
            const response = await axios.get(`/services/`);
            setServices(response.data.result);
        } catch {
            err => alert(err);
        }
    };
    useEffect(() => {
        getServices();
    }, []);

    const handleListItemClick = (e, i) => {
        setSelectedIndex(i);
    };

    return (
        <div className={classes.rootPanel}>
            <div className={classes.searchBar}>
                <IconButton className={classes.iconButton} aria-label="menu">
                    <Menu />
                </IconButton>
                <InputBase className={classes.input} placeholder="Search" />
                <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search">
                    <Search />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
            </div>
            <div className={classes.rootList}>
                <List>
                    {services
                        ? services.map((service, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    classes={style}
                                    onClick={e => handleListItemClick(e, index)}
                                    selected={selectedIndex == index}
                                    divider={true}>
                                    <p className={classes.bullet}>&bull;</p>
                                    <ServiceCard
                                        service={service}
                                        index={index}
                                        className={classes.serviceCard}
                                        serviceTags={service.serviceTags}
                                    />
                                </ListItem>
                            );
                        })
                        : null}
                </List>
            </div>
        </div>
    );
};

export default ServiceList;
