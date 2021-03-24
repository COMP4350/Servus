import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        position: 'relative',
        width: '50%',
        height: '100%',
        backgroundColor: 'lightgrey',
    },
}));

const ImageBoard = props => {
    const [images, setImages] = useState([]);
    const classes = useStyles();
    const getImages = async () => {
        const response = await axios.get(`/images/${props.username}`);
        console.log(response);
        let image_grid = [];
        let images = response.data.result;
        images.sort((a, b) => {
            a.uploadDate <= b.uploadDate ? 1 : -1;
        });
        let grid_index = 0;
        for (let i in images) {
            if (grid_index == 0) {
                image_grid.push([]);
            }
            image_grid[grid_index].push(images[i]);
            grid_index = (grid_index + 1) % 3;
        }
        console.log(image_grid);
        setImages(image_grid);
    };
    useEffect(() => {
        getImages();
    }, []);

    const getImageBoard = () => {
        return (
            <Grid container spacing={1}>
                {images.map((setOfThree, index) => {
                    return (
                        <Grid container item xs={12} spacing={2} key={index}>
                            {setOfThree.map((oneImage, x) => {
                                return (
                                    <Grid item xs={4} key={x}>
                                        {oneImage.imageName}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <div className={classes.root}>{images ? getImageBoard() : null}</div>
    );
};

export default ImageBoard;
