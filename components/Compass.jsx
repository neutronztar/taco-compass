import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import haversine from 'haversine-distance';
import TacoCompass from '../svg/TacoCompass';

const Compass = ({
    myLatitude,
    myLongitude,
    tacoBellLatitude,
    tacoBellLongitude,
}) => {
    const [headingSub, setHeadingSub] = useState(null);
    const [heading, setHeading] = useState(null);

    const tBellAngle = useMemo(() => {
        if (
            !myLatitude ||
            !myLongitude ||
            !tacoBellLatitude ||
            !tacoBellLongitude
        ) {
            return null;
        } else {
            rise = tacoBellLatitude - myLatitude;
            run = tacoBellLongitude - myLongitude;
            return Math.atan2(rise, run) * (180 / Math.PI);
        }
    }, [myLatitude, myLongitude, tacoBellLatitude, tacoBellLongitude]);

    const finalAngle = useMemo(() => {
        if (!(tBellAngle && heading && heading.trueHeading)) {
            return null;
        } else {
            return (tBellAngle + heading.trueHeading).toString();
        }
    }, [tBellAngle, heading]);

    const distance = useMemo(() => {
        if (
            !myLatitude ||
            !myLongitude ||
            !tacoBellLatitude ||
            !tacoBellLongitude
        ) {
            return null;
        } else {
            return haversine(
                { lat: myLatitude, lon: myLongitude },
                { lat: tacoBellLatitude, lon: tacoBellLongitude }
            );
        }
    }, [myLatitude, myLongitude, tacoBellLatitude, tacoBellLongitude]);

    useEffect(() => {
        subToHeading();
        return unsubFromHeading;
    }, []);

    const subToHeading = () => {
        Location.watchHeadingAsync((heading) => {
            setHeading(heading);
        }).then(
            (sub) => setHeadingSub(sub),
            (error) => console.log(error)
        );
    };

    const unsubFromHeading = () => {
        headingSub && headingSub.remove();
        setHeadingSub(null);
    };

    return (
        <View>
            {finalAngle ? (
                <>
                    <Text>Distance: {distance} m</Text>
                    <TacoCompass angle={finalAngle} />
                </>
            ) : (
                <Text>no angle data</Text>
            )}
        </View>
    );
};

export default Compass;
