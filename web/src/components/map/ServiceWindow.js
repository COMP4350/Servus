import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Button, Modal, Box, IconButton } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { AccountBox, Favorite } from '@material-ui/icons/';
import BookWindow from './BookWindow';
import { useCookies } from 'react-cookie';

const StyledRating = withStyles({
    iconFilled: {
        color: '#ff6d75',
    },
    iconHover: {
        color: '#EC5732',
    },
})(Rating);

const useStyles = makeStyles(() => ({
    window: {
        display: 'flex',
        'flex-direction': 'column',
        'align-items': 'center',
        overflow: 'visible',
        padding: 10,
        maxWidth: '200',
    },
    upperRow: {
        width: '100%',
        height: '50%',
        display: 'flex',
        'flex-direction': 'row',
        justifyContent: 'space-evenly',
    },
    lowerRow: {
        width: '100%',
        height: '50%',
        textAlign: 'left',
    },
    userIcon: {
        height: '96px',
        width: '96px',
        padding: 0,
        margin: 0,
    },
    iconButton: {
        height: 96,
        width: 96,
        padding: 0,
        margin: 0,
    },
    info: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    infoBar: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    title: {
        fontSize: '1.75em',
    },
    modal: {
        height: '35%',
        width: '35%',
        margin: 'auto auto',
    },
    provider: {
        fontSize: '1.25em',
        marginTop: 0,
    },
    desc: {
        marginTop: 5,
        'word-wrap': 'break-word',
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        margin: 0,
    },
    innerBox: {
        margin: 0,
        textAlign: 'left',
        lineHeight: '2',
        marginLeft: 7,
    },
    book: {
        marginTop: 10,
    },
}));

const ServiceWindow = props => {
    const getAvgRating = arr => {
        let sum = 0;
        let len = arr.length;
        arr.map(rating => {
            sum += rating.rating;
        });
        return len > 0 ? sum / len : 0;
    };

    const [cookies] = useCookies();

    const classes = useStyles();
    const [seen, setSeen] = useState(false);

    const [rating, setRating] = useState(getAvgRating(props.service.ratings));

    const togglePop = () => {
        setSeen(!seen);
    };

    const changePage = () => {
        props.history.push(`/profile/${props.service.provider}`);
    };

    const addRating = async val => {
        if (cookies.username) {
            const res = await axios.put(`/services/${props.service._id}/rate`, {
                rating: val,
                username: cookies.username,
            });
            console.log(res.data.result.ratings);
            setRating(getAvgRating(res.data.result.ratings));
        }
    };
    return (
        <div className={classes.window}>
            <div className={classes.upperRow}>
                <IconButton onClick={changePage} className={classes.iconButton}>
                    <AccountBox className={classes.userIcon} />
                </IconButton>
                <div className={classes.infoBar}>
                    <Typography variant="h1" className={classes.title}>
                        {props.service.name}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        className={classes.provider}>
                        {`@${props.service.provider}`}
                    </Typography>
                    <Box ml={2} className={classes.box}>
                        <StyledRating
                            name="customized-color"
                            value={rating}
                            getLabelText={value =>
                                `${value} Heart ${value !== 1 ? 's' : ''}`
                            }
                            onChange={(e, val) => {
                                addRating(val);
                            }}
                            precision={0.5}
                            icon={<Favorite fontSize="inherit" />}
                        />
                    </Box>
                </div>
            </div>
            <div className={classes.lowerRow} align="left">
                <div className={classes.info}>
                    <Typography
                        variant="body2"
                        component="p"
                        className={classes.desc}>
                        {props.service.description}
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={togglePop}
                        className={classes.book}>
                        Book
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
