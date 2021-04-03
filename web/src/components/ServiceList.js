import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    makeStyles,
    InputBase,
    Divider,
    IconButton,
    List,
    ListItem,
    Paper,
    Chip,
} from '@material-ui/core';
import { FilterList, Search } from '@material-ui/icons/';
import { tagNames } from './FilterList';

// import useForm from '../hooks/useForm';

import ServiceCard from './ServiceCard';

const useStyles = makeStyles(theme => ({
    rootPanel: {
        [theme.breakpoints.up('lg')]: {
            minWidth: '384px',
            width: '384px',
            height: '100%',
        },
        'background-color': theme.background.dark,
        'overflow-y': 'scroll',
    },
    rootList: {
        padding: '8px',
        width: 'auto',
        height: 'auto',
        overflow: 'scroll',
        'overflow-x': 'hidden',
    },
    list: {},
    filters: {
        'background-color': theme.background.dark,
        margin: 'auto auto',
        width: '100%',
    },
    searchBar: {
        margin: '4%',
        padding: '0',
        width: '92%',
        height: '40px',
        'background-color': theme.background.main,
        'border-radius': '12px',
    },
    searchIcon: {
        cursor: 'pointer',
        color: 'white',
    },
    tag: {
        margin: '2px',
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

const listItemClass = makeStyles(theme => ({
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
        'border-color': theme.background.main,
    },
}));

const ServiceList = () => {
    const [services, setServices] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [serviceTags, setServiceTags] = useState(false);
    const [activeFilters] = useState([]);
    const [change, setChange] = useState(false);

    // const [searchForm, onSearchFormChange] = useForm({ search: '' });
    const classes = useStyles();
    const style = listItemClass();
    const getServices = async () => {
        try {
            const response = await axios.post(`/services/filter`, {
                tags: activeFilters,
            });
            setServices(response.data.result);
        } catch {
            err => alert(err);
        }
    };

    const handleListItemClick = (e, i) => {
        setSelectedIndex(i);
    };

    const openFilterList = () => {
        setServiceTags(!serviceTags);
    };

    const loadChips = () => {
        return (
            <Paper className={classes.filters}>
                {serviceTags
                    ? tagNames.map((tag, i) => {
                          return (
                              <Chip
                                  size="small"
                                  key={i}
                                  label={tag}
                                  onClick={() => addFilter(tag)}
                                  className={classes.tag}
                                  color={
                                      activeFilters.includes(tag)
                                          ? 'secondary'
                                          : 'primary'
                                  }
                              />
                          );
                      })
                    : null}
            </Paper>
        );
    };

    const addFilter = tag => {
        if (activeFilters.includes(tag)) {
            const index = activeFilters.indexOf(tag);
            if (index > -1) activeFilters.splice(index, 1);
        } else {
            activeFilters.push(tag);
        }
        console.log(activeFilters);
        setChange(!change);
    };

    useEffect(() => {
        getServices();
        loadChips();
    }, [serviceTags, change]);

    return (
        <Paper className={classes.rootPanel}>
            <Paper className={classes.searchBar}>
                <IconButton
                    className={classes.iconButton}
                    onClick={openFilterList}
                    aria-label="menu">
                    <FilterList />
                </IconButton>
                <InputBase className={classes.input} placeholder="Search" />
                <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search">
                    <Search />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
            </Paper>
            {loadChips()}
            <List className={classes.rootList}>
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
        </Paper>
    );
};

export default ServiceList;
