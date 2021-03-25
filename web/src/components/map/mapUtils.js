import mapStyle from './mapStyle.json';

export const winnipeg = {
    lat: 49.8951,
    lng: -97.1384,
};

export const mapLibraries = ['places'];

export const defaultBounds = {
    north: winnipeg.lat + 1.0,
    south: winnipeg.lat - 1.0,
    east: winnipeg.lng + 1.0,
    west: winnipeg.lng - 1.0,
};

export const autocompleteOptions = {
    bounds: defaultBounds,
    componentRestrictions: { country: 'ca' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    origin: winnipeg,
    strictBounds: true,
};

export const mapOptions = {
    mapTypeControl: false,
    disableDefaultUI: true,
    zoomControl: true,
    styles: mapStyle,
};
