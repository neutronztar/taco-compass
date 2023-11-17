import { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View } from 'react-native';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';

import Compass from '../components/Compass';
import ScreenHeaderBtn from '../components/ScreenHeaderBtn';
import Gear from '../svg/Gear';
import TacoDab from '../svg/TacoDab';
import COLORS from '../style/colors';

const showDebug = false;

const Home = () => {
    const router = useRouter();

    const [positionSub, setPositionSub] = useState(null);
    const [closestTBell, setClosestTBell] = useState(null);
    const [myLocation, setMyLocation] = useState(null);

    // Updates less frequently than myLocation.
    // Used to trigger Google Maps API call.
    const [baseLocation, setBaseLocation] = useState(null);
    const baseLocationRef = useRef(null);
    baseLocationRef.current = baseLocation;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiCount, setApiCount] = useState(0);

    useEffect(() => {
        if (
            baseLocation &&
            baseLocation.coords &&
            baseLocation.coords.latitude &&
            baseLocation.coords.longitude
        ) {
            console.log(
                'hitting api with base location of',
                baseLocation.coords.latitude,
                baseLocation.coords.longitude
            );
            setLoading(true);
            axios
                .get(
                    'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
                    {
                        params: {
                            keyword: 'taco bell',
                            location:
                                baseLocation.coords.latitude +
                                ',' +
                                baseLocation.coords.longitude,
                            rankby: 'distance',
                            key: 'AIzaSyCsewLgFUc7g5GZt5PeBFxpwyqD_udHZTw',
                        },
                    }
                )
                .then((response) => {
                    console.log(
                        'got coordinates of',
                        response.data.results.length,
                        'Taco Bells'
                    );
                    setClosestTBell(response.data.results[0]);
                    setError(null);
                })
                .catch((err) => {
                    setClosestTBell(null);
                    setError(err);
                })
                .finally(() => {
                    setLoading(false);
                    setApiCount(apiCount + 1);
                });
        }
    }, [baseLocation]);

    useEffect(() => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status != 'granted') {
                console.log('Please grant location permissions');
            }
        };

        getPermissions();
    }, []);

    useEffect(() => {
        subToPosition();
        return unsubFromPosition;
    }, []);

    const updatePosition = (pos) => {
        console.log('updating position');
        setMyLocation(pos);

        // Only update the base location if user moves far enough.
        // This limits Google API requests and adds hysteresis.
        if (baseLocationRef.current == null) {
            console.log('initial set of base location');
            console.log(baseLocationRef.current);
            setBaseLocation(pos);
            return;
        }
        if (haversine(pos.coords, baseLocationRef.current.coords) > 100) {
            console.log('updating base location');
            setBaseLocation(pos);
            return;
        }
    };

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.header },
                    headerTitleStyle: { color: COLORS.headerTitle },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            Icon={TacoDab}
                            handlePress={() => {
                                router.push('/info');
                            }}
                        />
                    ),
                    headerRight: () => (
                        <ScreenHeaderBtn
                            Icon={Gear}
                            handlePress={() => {
                                router.push('/settings');
                            }}
                        />
                    ),
                    headerTitle: 'Taco Compass',
                    headerTitleAlign: 'center',
                }}
            />
            {showDebug ? (
                <View>
                    <Text>Error: {error}</Text>
                    <Text>Loading: {loading ? 'true' : 'false'}</Text>
                    <Text>API Count: {apiCount}</Text>
                    <Text>
                        My Lat: {myLocation?.coords?.latitude?.toFixed(5)}
                    </Text>
                    <Text>
                        My Lon: {myLocation?.coords?.longitude?.toFixed(5)}
                    </Text>
                    <Text>
                        T Lat:{' '}
                        {closestTBell?.geometry?.location?.lat?.toFixed(5)}
                    </Text>
                    <Text>
                        T Lon:{' '}
                        {closestTBell?.geometry?.location?.lng?.toFixed(5)}
                    </Text>
                </View>
            ) : (
                <></>
            )}

            <Compass
                myLatitude={myLocation?.coords?.latitude}
                myLongitude={myLocation?.coords?.longitude}
                tacoBellLatitude={closestTBell?.geometry?.location?.lat}
                tacoBellLongitude={closestTBell?.geometry?.location?.lng}
                address={closestTBell?.vicinity}
                showDebug={showDebug}
            />
        </SafeAreaView>
    );
};

export default Home;
