import React from 'react';
import { Card, makeStyles, Typography } from '@material-ui/core';
import { Chip } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    cardView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        color: 'white',
        width: 'auto',
    },
    chip: {
        margin: 2,
    }
}));

const ServiceCard = props => {
    const classes = useStyles();
    const serviceTags = props.service.tags
        ? props.service.tags
        : [];
    return (
        <Card variant="outlined" className={classes.cardView} key={props.index}>
            <Typography variant="body1" className={classes.title} align="left">
                {props.service.name}
            </Typography>
            <div>
                {serviceTags?.map((tagData, i) => {
                    return (
                        <Chip
                            key={i}
                            size="small"
                            label={tagData}
                            className={classes.chip}
                        />
                    )
                })}
            </div>
        </Card>
    );
};

export default ServiceCard;
