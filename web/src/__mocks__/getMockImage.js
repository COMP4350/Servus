function getMockImage() {
    return {
        ownerUsername: 'riki',
        uploadDate: new Date(2012, 1, 1),
        imageName: 'example_image.jpeg',
        imageData: 'the/link/to/data',
        profilePicture: false,
    };
}

export const mockImage = getMockImage();
