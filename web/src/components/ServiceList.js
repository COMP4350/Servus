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
    Typography,
} from '@material-ui/core';
import { FilterList, Search } from '@material-ui/icons/';
import tagNames from './FilterList';
import ServiceCard from './ServiceCard';
import useForm from '../hooks/useForm';

// Styles for the service list (left side) panel.
const useStyles = makeStyles(theme => ({
    rootPanel: {
        [theme.breakpoints.up('xs')]: {
            minWidth: '384px',
            width: '384px',
            height: '100%',
        },
        'background-color': theme.background.dark,
        'overflow-y': 'scroll',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            height: '100%',
        },
    },
    rootList: {
        padding: '8px',
        width: 'auto',
        height: 'auto',
        'overflow-x': 'hidden',
    },
    filters: {
        'background-color': theme.background.dark,
        margin: '4%',
        width: '92%',
    },
    searchBar: {
        margin: '4%',
        padding: '0',
        width: '92%',
        height: '40px',
        'flex-wrap': 'nowrap',
        'background-color': theme.background.main,
        'border-radius': '12px',
    },
    searchIcon: {
        cursor: 'pointer',
        color: 'white',
        width: '12.5%',
        padding: 10,
    },
    searchInput: {
        width: '75%',
        flex: 1,
        color: 'white',
    },
    tagChip: {
        margin: '2px',
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

// Styles for the list item contents.
const listItemClass = makeStyles(theme => ({
    root: {
        '& p': {
            color: '#545454',
        },
        padding: '0',
        'padding-top': '4px',
        'padding-bottom': '4px',
        height: 'auto',
        width: 'auto',
    },
    selected: {
        '& p': {
            color: 'white',
        },
    },
    divider: {
        'border-color': theme.background.main,
    },
}));

// Service List component.
const ServiceList = props => {
    const [services, setServices] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [serviceTags, setServiceTags] = useState(false);
    const [activeFilters] = useState([]);
    const [change, setChange] = useState(false);
    const [searchForm, setSearchForm] = useForm({ search: '' });
    const [errorText, setErrorText] = useState('');

    const classes = useStyles();
    const style = listItemClass();
    const getServices = async () => {
        try {
            const response = await axios.post(`/services/filter`, {
                tags: activeFilters,
                search: searchForm.search,
            });
            setServices(response.data.result);
        } catch {
            err => setErrorText(err);
        }
    };

    const handleListItemClick = (e, i) => {
        setSelectedIndex(i);
    };

    const openFilterList = () => {
        setServiceTags(!serviceTags);
    };

    // Show the chips used to set tag filters.
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
                                  className={classes.tagChip}
                                  color={
                                      activeFilters.includes(tag)
                                          ? 'primary'
                                          : 'default'
                                  }
                              />
                          );
                      })
                    : null}
            </Paper>
        );
    };

    // Add a tag to the current list of tag filters.
    const addFilter = tag => {
        if (activeFilters.includes(tag)) {
            const index = activeFilters.indexOf(tag);
            if (index > -1) activeFilters.splice(index, 1);
        } else {
            activeFilters.push(tag);
        }
        setChange(!change);
        setSelectedIndex(-1);
    };

    const search = () => {
        console.log(`searching: ${searchForm.search}`);
    };

    const onServiceFormChange = e => {
        setSearchForm(e);
    };

    useEffect(() => {
        getServices();
        loadChips();
    }, [serviceTags, change, searchForm.search]);

    return (
        <Paper className={classes.rootPanel}>
            <Paper className={classes.searchBar}>
                <IconButton
                    className={classes.searchIcon}
                    onClick={openFilterList}
                    aria-label="menu">
                    <FilterList />
                </IconButton>
                <InputBase
                    className={classes.searchInput}
                    placeholder="Search"
                    name="search"
                    onChange={onServiceFormChange}
                    value={searchForm.search}
                    onKeyDown={e =>
                        e.key === 'Enter' ? search() : console.log(e.key)
                    }
                />
                <IconButton
                    type="submit"
                    className={classes.searchIcon}
                    onClick={search}
                    aria-label="search">
                    <Search />
                </IconButton>
                <Divider className={classes.divider} orientation="vertical" />
            </Paper>
            {loadChips()}
            <List className={classes.rootList}>
                {services
                    ? services.map((service, index) => {
                          if (selectedIndex == index) {
                              props.setSelectedService(service);
                          }
                          return (
                          <div
                            data-cy={`service_${index}`}
                            key={index}>
                              <ListItem 
                                  classes={style}
                                  onClick={e => handleListItemClick(e, index)}
                                  selected={selectedIndex == index}
                                  divider={true}
                                  >
                                  <ServiceCard
                                      service={service}
                                      index={index}
                                      className={classes.serviceCard}
                                      selected={selectedIndex == index}
                                      expand={false}
                                  />
                              </ListItem>
                          </div>
                          );
                      })
                    : <Typography>{errorText}</Typography>}
            </List>
        </Paper>
    );
};

export default ServiceList;
