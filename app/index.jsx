import { useState, useEffect, useRef } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';

import Maps from '../components/Maps';
import ScreenHeaderBtn from '../components/ScreenHeaderBtn';
import Taco from '../svg/Taco';
import COLORS from '../style/colors';

const showDebug = false;

const Home = () => {
    const router = useRouter();

    const [locationPermissionStatus, setLocationPermissionStatus] =
        useState(null);

    const setLocationPermissionStatusRef = useRef(null);
    setLocationPermissionStatusRef.current = setLocationPermissionStatus;

    useEffect(() => {
        getPermissions();
    }, []);

    const getPermissions = async () => {
        let status = await Location.requestForegroundPermissionsAsync();
        setLocationPermissionStatus(status);
    };

    // Poll location permission in case user changes it
    useEffect(() => {
        const interval = setInterval(() => {
            Location.getForegroundPermissionsAsync().then(
                (r) => {
                    setLocationPermissionStatusRef.current(r);
                },
                () => {
                    console.log('error with getForegroundPermissionsAsync()');
                }
            );
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.header },
                    headerTitleStyle: { color: COLORS.headerTitle },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            Icon={Taco}
                            handlePress={() => {
                                router.push('/info');
                            }}
                        />
                    ),
                    // Setting menu is commented for now, will uncomment when I add some settings
                    // headerRight: () => (
                    //     <ScreenHeaderBtn
                    //         Icon={Gear}
                    //         handlePress={() => {
                    //             router.push('/settings');
                    //         }}
                    //     />
                    // ),
                    headerTitle: 'Taco Compass',
                    headerTitleAlign: 'center',
                }}
            />
            {showDebug ? (
                <Text>
                    Location Permission Status:{' '}
                    {JSON.stringify(locationPermissionStatus)}
                </Text>
            ) : (
                <></>
            )}
            {locationPermissionStatus?.status == 'granted' ? (
                <Maps showDebug={showDebug} />
            ) : (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                textAlign: 'center',
                                padding: 20,
                            }}
                        >
                            Please go to your settings app and grant location
                            permission, then press the taco to refresh.
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                        }}
                    >
                        {/* we wrap the SVG in a view that preserves its aspect ratio */}
                        <TouchableOpacity
                            style={{
                                aspectRatio: 1,
                                alignItems: 'center',
                            }}
                            onPress={getPermissions}
                        >
                            <Taco width="50%" height="50%" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Home;
