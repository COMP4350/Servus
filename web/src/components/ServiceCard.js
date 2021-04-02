import React from 'react';
import { Card, makeStyles, Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

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
    const serviceTags = props.service.serviceTags
        ? props.service.serviceTags
        : [];
    return (
        <Card variant="outlined" className={classes.cardView} key={props.index}>
            <Typography variant="h2" className={classes.title} align="left">
                {props.service.name}
            </Typography>
            <div className={classes.chips}>
                {serviceTags.map(tag => (
                    <Chip key={tag} label={tag} className={classes.chip} />
                ))}
            </div>
        </Card>
    );
};

export default ServiceCard;
