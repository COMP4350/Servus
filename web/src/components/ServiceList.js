import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import ServiceCard from './ServiceCard';
import Search from '@material-ui/icons/Search';
import { TextField, InputAdornment } from '@material-ui/core';
import useForm from '../hooks/useForm';

const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 400,
        marginLeft: 10,
        marginTop: 10,
    },
    searchBar: {
        marginBottom: '10px',
    },
    searchIcon: {
        cursor: 'pointer',
    },
}));

const ServiceList = () => {
    const [services, setServices] = useState(null);
    const [searchForm, onSearchFormChange] = useForm({ search: '' });
    const classes = useStyles();
    const getServices = async () => {
        const response = await axios.get(`/services/`);
        setServices(response.data.result);
    };
    useEffect(() => {
        getServices();
    }, []);
    const search = () => {
        console.log(`searching ${searchForm.search}`);
    };
    return (
        <div>
            <div className={classes.root}>
                <TextField
                    className={classes.serchBar}
                    id="input-with-icon-textfield"
                    label="Search"
                    name="search"
                    onChange={onSearchFormChange}
                    value={searchForm.search}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment
                                className={classes.searchIcon}
                                position="end"
                                onClick={search}>
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    onKeyDown={e => (e.key === 'Enter' ? search : null)}
                />
                {services
                    ? services.map((service, index) => {
                          return (
                              <ServiceCard
                                  key={index}
                                  service={service}
                                  index={index}
                                  bg={{ backgroundColor: '#647AA3' }}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
};

export default ServiceList;
