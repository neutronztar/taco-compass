import haversine from 'haversine-distance';

const calculateNearestStore = (myLocation, nearByStores) => {
    let nearest = nearByStores[0];
    let shortestDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < nearByStores.length; i++) {
        let d = haversine(myLocation.coords, nearByStores[i].geoPoint);

        // Uncomment for debugging
        // console.log(
        //     'distance to',
        //     nearByStores[i].address.formattedAddress,
        //     'is',
        //     d.toFixed()
        // );

        if (d < shortestDistance) {
            shortestDistance = d;
            nearest = nearByStores[i];
        }
    }

    console.log('setting nearest to', nearest?.address?.formattedAddress);

    return nearest;
};

export default calculateNearestStore;
