const MESA_TACO_BELL = {
    latitude: 33.394262457459355,
    longitude: -111.87415558730642,
};

const SALT_LAKE_TACO_BELL = {
    latitude: 40.76097294145581,
    longitude: -111.87304162118241,
};

const WELLS_FARGO = {
    latitude: 40.76323562558469,
    longitude: -111.8800279582034,
};

export const findClosestTacoBell = () => {
    return {
        address: 'WELLS FARGO',
        latitude: WELLS_FARGO.latitude,
        longitude: WELLS_FARGO.longitude,
    };
};
