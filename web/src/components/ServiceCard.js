import React from 'react';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    cardView: {
        padding: theme.spacing(2),
    },
    title: {
        fontSize: 14,
    },
    details: {
        margin: '0 2px',
    },
}));

const ServiceCard = props => {
    const classes = useStyles();
    return (
        <Card
            style={props.bg}
            variant="outlined"
            className={classes.cardView}
            key={props.index}>
            <h2 className={classes.title}>{props.service.name}</h2>
            <div className={classes.details}>
                <p>Provider: {props.service.provider}</p>
                <p>Info: {props.service.description}</p>
                <p>$: {props.service.cost}</p>
                <p>Time: {props.service.duration}</p>
                <p>availability: {props.service.availability}</p>

            </div>
        </Card>
    );
};

export default ServiceCard;
