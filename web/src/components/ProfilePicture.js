import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { AccountBox } from '@material-ui/icons/';

const useStyles = makeStyles(() => ({
    pic: {
        width: 96,
        height: 96,
        padding: 5,
    },
    icon: {
        width: 96,
        height: 96,
    },
}));

const ProfilePicture = props => {
    const classes = useStyles();
    const [image, setImage] = useState(null);

    const getImages = async () => {
        const response = await axios.get(`/images/${props.username}/profile`);
        setImage(response.data.result);
    };

    useEffect(() => {
        getImages();
    }, [props.username]);

    return (
        <div className={classes.container}>
            {image ? (
                <img
                    src={`${process.env.REACT_APP_API_HOST}/${image.imageData}`}
                    className={classes.pic}
                />
            ) : (
                <AccountBox className={classes.icon} />
            )}
        </div>
    );
};

export default ProfilePicture;
