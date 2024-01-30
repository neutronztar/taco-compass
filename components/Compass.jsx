import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation';
import LatLonS from 'geodesy/latlon-spherical';

import TacoCompass from '../svg/TacoCompass';
import LoadingTaco from './LoadingTaco';

const orientationCompensation = {
    0: 0, //   UNKNOWN
    1: 0, //   PORTRAIT_UP
    2: 180, // PORTRAIT_DOWN
    3: 270, // LANDSCAPE_LEFT
    4: 90, //  LANDSCAPE_RIGHT
};

const Compass = ({
    myLatitude,
    myLongitude,
    tacoBellLatitude,
    tacoBellLongitude,
    address,
    showDebug,
}) => {
    const [headingSub, setHeadingSub] = useState(null);
    const [heading, setHeading] = useState(null);
    const [screenOrientation, setScreenOrientation] = useState(null);

    const tBellAngle = useMemo(() => {
        if (
            !myLatitude ||
            !myLongitude ||
            !tacoBellLatitude ||
            !tacoBellLongitude
        ) {
            return null;
        } else {
            // Use the great circle path method to find the initial bearing from North towards the destination
            p1 = new LatLonS(myLatitude, myLongitude);
            p2 = new LatLonS(tacoBellLatitude, tacoBellLongitude);
            bearing = p1.initialBearingTo(p2);

            // Convert from 'degrees CW from North' to 'degrees CCW from East'
            return -bearing + 90;
        }
    }, [myLatitude, myLongitude, tacoBellLatitude, tacoBellLongitude]);

    const finalAngle = useMemo(() => {
        if (
            !(tBellAngle && heading && heading.trueHeading && screenOrientation)
        ) {
            return null;
        } else {
            return (
                tBellAngle +
                heading.trueHeading +
                orientationCompensation[screenOrientation]
            );
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
            // Use haversine formula to calculate the distance along the surface of the earth to the destination
            p1 = new LatLonS(myLatitude, myLongitude);
            p2 = new LatLonS(tacoBellLatitude, tacoBellLongitude);
            return p1.distanceTo(p2);
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

    ScreenOrientation.getOrientationAsync().then((data) => {
        setScreenOrientation(data);
    });

    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {finalAngle ? (
                    <>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 45,
                                    fontWeight: 'bold',
                                    paddingHorizontal: 20,
                                }}
                            >
                                {distance.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                })}{' '}
                                meters
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 2,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* we wrap the SVG in a view that preserves its aspect ratio */}
                            <View style={{ aspectRatio: 1 }}>
                                <TacoCompass
                                    angle={finalAngle}
                                    height="100%"
                                    width="100%"
                                />
                            </View>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                Your nearest Taco Bell is
                            </Text>
                            <Text
                                style={{
                                    fontSize: 30,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    paddingHorizontal: 20,
                                }}
                            >
                                {address}
                            </Text>
                        </View>
                    </>
                ) : (
                    <LoadingTaco />
                )}
            </View>
            {showDebug ? (
                <View>
                    <Text>Orientation: {screenOrientation}</Text>
                    <Text>tBellAngle: {tBellAngle?.toFixed()}</Text>
                    <Text>finalAngle: {finalAngle?.toFixed()}</Text>
                </View>
            ) : (
                <></>
            )}
        </>
    );
};

export default Compass;
