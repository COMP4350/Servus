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
        height: '100%',
        width: '96px',
    },
    info: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    title: {
        fontSize: '2em',
    },
    modal: {
        height: '35%',
        width: '35%',
        margin: 'auto auto',
    },
    provider: {
        marginTop: 5,
    },
    desc: {
        marginTop: 5,
    },
    buttons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: 5,
    },
}));

const ServiceWindow = props => {
    const classes = useStyles();
    const [seen, setSeen] = useState(false);

    const togglePop = () => {
        setSeen(!seen);
    };

    const changePage = () => {
        props.history.push(`/profile/${props.service.provider}`);
    };

    return (
        <div className={classes.window}>
            <AccountCircle className={classes.userIcon} />
            <div className={classes.info}>
                <Typography variant="h1" className={classes.title}>
                    {props.service.name}
                </Typography>
                <Typography color="textSecondary" className={classes.provider}>
                    {`@${props.service.provider}`}
                </Typography>
                <Typography
                    variant="body2"
                    component="p"
                    className={classes.desc}>
                    {props.service.description}
                </Typography>
                <div className={classes.buttons}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={togglePop}
                        className={classes.book}>
                        Book
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={changePage}
                        className={classes.book}>
                        Profile
                    </Button>
                </div>
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
