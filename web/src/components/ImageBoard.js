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
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
        width: '60%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'lightgrey',
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
        width: '100%',
        height: '100%',
    },
    icon: {
        width: '50px',
        height: '50px',
    },
}));

const inputStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        height: '75px',
        width: '75px',
        backgroundColor: 'lightgrey',
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
}));

const ImageBoard = props => {
    const [images, setImages] = useState([]);
    const classes = useStyles();
    const inputclasses = inputStyles();
    const [cookies] = useCookies(['username']);
    let { targetUsername } = useParams();

    const getImages = async () => {
        const response = await axios.get(`/images/${props.username}`);
        console.log(response);
        let images = response.data.result;
        images.sort((a, b) => {
            a.uploadDate <= b.uploadDate ? 1 : -1;
        });

        setImages(images);
    };
    useEffect(() => {
        getImages();
    }, []);

    const getImageBoard = () => {
        console.log(images);
        return (
            <GridList cellHeight={200} className={classes.gridList} cols={3}>
                {images.map((oneImage, index) => {
                    return (
                        <GridListTile cols={1} key={index}>
                            <img
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
        imageFormObj.append('ownerUsername', props.username);

        // stores a readable instance of the image being uploaded using multer
        axios
            .post(`/images/upload`, imageFormObj)
            .then(() => {})
            .catch(err => {
                alert('Error while uploading image' + err);
            });
    };
    return (
        <div className={classes.root}>
            {images ? getImageBoard() : null}

            {cookies.username && cookies.username === targetUsername ? (
                <div className={classes.inputRoot}>
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

export default ImageBoard;