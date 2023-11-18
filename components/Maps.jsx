import { useState, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import axios from 'axios';

import Compass from '../components/Compass';
import calculateNearestStore from '../util/nearest';

const DISTANCE_BETWEEN_CLOSENESS_CHECKS = 25; // meters
const DISTANCE_BETWEEN_API_HITS = 3000; // meters

const Maps = ({ showDebug }) => {
    const [positionSub, setPositionSub] = useState(null);
    const [myLocation, setMyLocation] = useState(null);
    const [nearByStores, setNearByStores] = useState(null);
    const [closestTBell, setClosestTBell] = useState(null);

    // Updates every time closest Taco Bell is re-checked
    const [baseLocation, setBaseLocation] = useState(null);
    const baseLocationRef = useRef(null);
    baseLocationRef.current = baseLocation;

    // Updates every time Taco Bell API is hit for a new Taco Bell list
    const [apiLocation, setApiLocation] = useState(null);
    const apiLocationRef = useRef(null);
    apiLocationRef.current = apiLocation;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // For debugging
    const [apiCount, setApiCount] = useState(0);
    const [baseLocationUpdateCount, setBaseLocationUpdateCount] = useState(0);
    const baseLocationUpdateCountRef = useRef(null);
    baseLocationUpdateCountRef.current = baseLocationUpdateCount;

    // Whenever apiLocation is updated, we ask the Taco Bell servers for a new list of Taco Bells
    useEffect(() => {
        if (
            apiLocation &&
            apiLocation.coords &&
            apiLocation.coords.latitude &&
            apiLocation.coords.longitude
        ) {
            console.log(
                'hitting api with location of',
                apiLocation.coords.latitude,
                apiLocation.coords.longitude
            );
            setLoading(true);
            axios
                .get('https://www.tacobell.com/store-finder/findStores', {
                    params: {
                        latitude: apiLocation.coords.latitude,
                        longitude: apiLocation.coords.longitude,
                    },
                })
                .then((response) => {
                    console.log(
                        'got list of',
                        response.data?.nearByStores?.length,
                        'nearby stores'
                    );
                    setNearByStores(response.data?.nearByStores);
                    if (
                        response.data?.nearByStores &&
                        response.data?.nearByStores.length > 0
                    ) {
                        setError(null);
                    } else {
                        setError('No nearby Taco Bells found');
                    }
                })
                .catch((err) => {
                    console.log('error with request');
                    setNearByStores(null);
                    setError(err);
                })
                .finally(() => {
                    setLoading(false);
                    setApiCount(apiCount + 1);
                });
        }
    }, [apiLocation]);

    // Whenever Base Location or nearByStores is updated, we re-calculate the nearest Taco Bell
    useEffect(() => {
        if (
            baseLocation &&
            baseLocation?.coords &&
            baseLocation?.coords?.latitude &&
            baseLocation?.coords?.longitude &&
            nearByStores
        ) {
            let n = calculateNearestStore(baseLocation, nearByStores);
            setClosestTBell(n);
        }
    }, [baseLocation, nearByStores]);

    useEffect(() => {
        subToPosition();
        return unsubFromPosition;
    }, []);

    const subToPosition = () => {
        console.log('subscribing to position');
        options = {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 3, // meters
        };
        Location.watchPositionAsync(options, updatePosition).then(
            (sub) => setPositionSub(sub),
            (error) => console.log(error)
        );
    };

    const unsubFromPosition = () => {
        console.log('unsubscribing from position');
        positionSub && positionSub.remove();
        setPositionSub(null);
        setMyLocation(null);
    };

    const updatePosition = (pos) => {
        console.log('updating position');
        setMyLocation(pos);

        // Only update the base location if user moves far enough.
        // This adds hysteresis to the compass.
        if (baseLocationRef.current == null) {
            console.log('initial set of base location');
            setBaseLocation(pos);
            setBaseLocationUpdateCount(baseLocationUpdateCountRef.current + 1);
        } else if (
            haversine(pos.coords, baseLocationRef.current.coords) >
            DISTANCE_BETWEEN_CLOSENESS_CHECKS
        ) {
            console.log('updating base location');
            setBaseLocation(pos);
            setBaseLocationUpdateCount(baseLocationUpdateCountRef.current + 1);
        }

        // Only update the API location if user moves far enough.
        // This limits API requests
        if (apiLocationRef.current == null) {
            console.log('initial set of API location');
            setApiLocation(pos);
        } else if (
            haversine(pos.coords, apiLocationRef.current.coords) >
            DISTANCE_BETWEEN_API_HITS
        ) {
            console.log('updating API location');
            setApiLocation(pos);
        }
    };

    return (
        <>
            {showDebug ? (
                <View>
                    <Text>Error: {String(error)}</Text>
                    <Text>Loading: {loading ? 'true' : 'false'}</Text>
                    <Text>API Count: {apiCount}</Text>
                    <Text>
                        Base Location Updates: {baseLocationUpdateCount}
                    </Text>
                    <Text>Num of NearBy Stores: {nearByStores?.length}</Text>
                    <Text>
                        My Lat: {myLocation?.coords?.latitude?.toFixed(5)}
                    </Text>
                    <Text>
                        My Lon: {myLocation?.coords?.longitude?.toFixed(5)}
                    </Text>
                    <Text>
                        T Lat: {closestTBell?.geoPoint?.latitude?.toFixed(5)}
                    </Text>
                    <Text>
                        T Lon: {closestTBell?.geoPoint?.longitude?.toFixed(5)}
                    </Text>
                </View>
            ) : (
                <></>
            )}

            {error ? (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: 20,
                        }}
                    >
                        {String(error)}
                    </Text>
                </View>
            ) : (
                <Compass
                    myLatitude={myLocation?.coords?.latitude}
                    myLongitude={myLocation?.coords?.longitude}
                    tacoBellLatitude={closestTBell?.geoPoint?.latitude}
                    tacoBellLongitude={closestTBell?.geoPoint?.longitude}
                    address={
                        closestTBell?.address?.line1 +
                        ', ' +
                        closestTBell?.address?.town
                    }
                    showDebug={showDebug}
                />
            )}
        </>
    );
};

export default Maps;
