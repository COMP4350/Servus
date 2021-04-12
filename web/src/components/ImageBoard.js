import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {
    IconButton,
    FilledInput,
    GridList,
    GridListTile,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles, withWidth, isWidthUp } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: theme.background.dark,
    },
    inputRoot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '75px',
        width: '75px',
    },
    btn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '75px',
        width: '75px',
        'pointer-events': 'none',
        'z-index': 6,
    },
    image: {
        width: '33%',
        height: 'auto',
        'object-fit': 'cover',
    },
    gridList: {
        alignContent: 'flex-start',
        width: '100%',
        height: '100%',
    },
    icon: {
        width: '50px',
        height: '50px',
        color: 'white',
    },
}));

const inputStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        height: '75px',
        width: '75px',
        bottom: 0,
        right: 0,
        'z-index': '4',
    },
    input: {
        display: 'inline-block',
        'box-sizing': 'border-box',
        'border-radius': '20px',
        height: '75px',
        width: '75px',
        overflow: 'hidden',
        padding: '120px 0 0 0',
        'z-index': '4',
    },
    toast: {
        marginTop: '60px',
    },
}));

const ImageBoard = props => {
    const [images, setImages] = useState([]);
    const classes = useStyles();
    const inputclasses = inputStyles();
    const [cookies] = useCookies(['username']);
    const [change, setChange] = useState(false);
    const imageError = () => toast.error('Could not upload image');
    let { targetUsername } = useParams();
    const getGridListCols = () => {
        if (isWidthUp('xl', props.width)) {
            return 4;
        }

        if (isWidthUp('lg', props.width)) {
            return 3;
        }

        return 2;
    };

    const getImages = async () => {
        const response = await axios.get(`/images/${targetUsername}`);
        let images = response.data.result;
        images.sort((a, b) => {
            a.uploadDate <= b.uploadDate ? 1 : -1;
        });
        setImages(images);
    };
    useEffect(() => {
        getImages();
    }, [targetUsername, change]);

    const getImageBoard = () => {
        console.log(images);
        return (
            <GridList
                cellHeight={200}
                className={classes.gridList}
                cols={getGridListCols()}>
                {images.map((oneImage, index) => {
                    return (
                        <GridListTile cols={1} key={index}>
                            <img
                                data-cy={`image-${index}`}
                                src={`${process.env.REACT_APP_API_HOST}/${oneImage.imageData}`}
                            />
                        </GridListTile>
                    );
                })}
            </GridList>
        );
    };

    const uploadImage = e => {
        let imageFormObj = new FormData();
        imageFormObj.append('imageName', 'multer-image-' + Date.now());
        imageFormObj.append('imageData', e.target.files[0]);
        imageFormObj.append('ownerUsername', targetUsername);
        imageFormObj.append('profilePicture', false);

        // stores a readable instance of the image being uploaded using multer
        axios
            .post(`/images/upload`, imageFormObj)
            .then(() => {
                setChange(!change);
            })
            .catch(() => imageError());
    };
    return (
        <div className={classes.root}>
            <ToastContainer className={classes.toast} />
            {images ? getImageBoard() : null}

            {cookies.username && cookies.username === targetUsername ? (
                <div data-cy="upload-image" className={classes.inputRoot}>
                    <IconButton className={classes.btn} variant="contained">
                        <PublishIcon className={classes.icon} />
                    </IconButton>
                    <FilledInput
                        classes={inputclasses}
                        type="file"
                        onChange={e => uploadImage(e, 'multer')}></FilledInput>
                </div>
            ) : null}
        </div>
    );
};

export default withWidth()(ImageBoard);
