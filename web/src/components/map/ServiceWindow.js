import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons/';
import BookWindow from './BookWindow';

const useStyles = makeStyles(() => ({
    window: {
        display: 'flex',
        'flex-direction': 'row',
        'align-items': 'center',
        overflow: 'visible',
    },
    userIcon: {
        height: '96px',
        width: '96px',
    },
    info: {
        padding: '10px',
    },
    title: {
        fontSize: '2em',
    },
    modal: {
        height: '35%',
        width: '35%',
        margin: 'auto auto',
    },
}));

const ServiceWindow = props => {
    const classes = useStyles();
    const [seen, setSeen] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };

    return (
        <div className={classes.window}>
            <AccountCircle className={classes.userIcon} />
            <div className={classes.info}>
                <Typography variant="h1" className={classes.title}>
                    {props.service.name}
                </Typography>
                <Typography color="textSecondary">
                    {`@${props.service.provider}`}
                </Typography>
                <Typography variant="body2" component="p">
                    {props.service.description}
                </Typography>
                <Button color="primary" variant="contained" onClick={togglePop}>
                    Book
                </Button>
            </div>

            <Modal
                className={classes.modal}
                open={seen}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description">
                <BookWindow service={props.service} toggle={togglePop} />
            </Modal>
        </div>
    );
};

export default ServiceWindow;
