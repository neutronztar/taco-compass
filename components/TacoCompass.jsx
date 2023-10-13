import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

import { Arrow } from '.';

const TacoCompass = ({
    myLatitude,
    myLongitude,
    tacoBellLatitude,
    tacoBellLongitude,
}) => {
    const [headingSub, setHeadingSub] = useState(null);
    const [heading, setHeading] = useState(null);

    useEffect(() => {
        subToHeading();
        return () => unsubFromHeading();
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

    let tBellAngle = null;
    if (myLatitude && myLongitude && tacoBellLatitude && tacoBellLongitude) {
        rise = tacoBellLatitude - myLatitude;
        run = tacoBellLongitude - myLongitude;
        tBellAngle = Math.atan2(rise, run) * (180 / Math.PI);
    }

    let finalAngle = null;
    if (tBellAngle && heading && heading.trueHeading) {
        finalAngle = (tBellAngle + heading.trueHeading).toString();
    }

    // console.log('heading: ', heading);
    // console.log('tBellAngle: ', tBellAngle);
    // console.log('finalAngle: ', finalAngle);

    return (
        <View>
            {finalAngle ? (
                <Arrow angle={finalAngle} />
            ) : (
                <Text>no angle data</Text>
            )}
        </View>
    );
};

export default TacoCompass;
