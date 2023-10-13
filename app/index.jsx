import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';

import { Compass, TacoCompass, TestCompass } from '../components';
import { findClosestTacoBell } from '../utils';

const Home = () => {
    const [positionSub, setPositionSub] = useState(null);
    const [closestTBell, setClosestTBell] = useState(null);
    const [myLocation, setMyLocation] = useState(null);

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
        return () => unsubFromPosition();
    }, []);

    const subToPosition = () => {
        Location.watchPositionAsync((pos) => {
            setMyLocation(pos);
        }).then(
            (sub) => setPositionSub(sub),
            (error) => console.log(error)
        );
    };

    const unsubFromPosition = () => {
        positionSub && positionSub.remove();
        setPositionSub(null);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'White' }}>
            <Text>TACOmpass</Text>
            <Text>Closest Taco Bell: {closestTBell}</Text>
            <TacoCompass
                myLatitude={myLocation?.coords?.latitude}
                myLongitude={myLocation?.coords?.longitude}
                tacoBellLatitude={findClosestTacoBell().latitude}
                tacoBellLongitude={findClosestTacoBell().longitude}
            />
        </View>
    );
};

export default Home;
