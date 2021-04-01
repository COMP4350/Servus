import React from 'react';
import { Card, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    cardView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        'line-height': '50px',
    },
}));

const ServiceCard = props => {
    const classes = useStyles();
    return (
        <Card variant="outlined" className={classes.cardView} key={props.index}>
            <Typography variant="h2" className={classes.title} align="left">
                {props.service.name}
            </Typography>
        </Card>
    );
};

export default ServiceCard;
