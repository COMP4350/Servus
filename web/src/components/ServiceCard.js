import React, { useState } from 'react';
import { Card, makeStyles, Typography, Button } from '@material-ui/core';
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
    },
}));

const formatDuration = duration => {
    const hours = parseInt(duration.charAt(0) + duration.charAt(1));
    const minutes = parseInt(duration.charAt(3) + duration.charAt(4));
    return hours > 0
        ? hours.toString() + (hours > 1 ? ' hours ' : ' hour ')
        : '' + minutes > 0
        ? minutes.toString() + ' minutes ' + minutes
        : '';
};

const ServiceCard = props => {
    const classes = useStyles();
    const serviceTags = props.service.tags ? props.service.tags : [];
    const [expanded, setExpanded] = useState(false);
    return (
        <Card
            onClick={() => setExpanded(!expanded)}
            variant="outlined"
            className={classes.cardView}
            key={props.index}>
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
                            color={props.selected ? 'secondary' : 'default'}
                            disabled={!props.selected}
                        />
                    );
                })}
            </div>
            {expanded ? (
                <div className={classes.expandedInfo}>
                    <Typography>{props.service.description}</Typography>
                    <Typography>Price: {props.service.cost}</Typography>
                    <Typography>
                        Duration: {formatDuration(props.service.duration)}
                    </Typography>
                    <Button>Book</Button>
                </div>
            ) : null}
        </Card>
    );
};

export default ServiceCard;
