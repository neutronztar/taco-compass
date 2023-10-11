import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

import { Arrow } from '../components';


const TACO_BELL = { latitude: 33.394262457459355, longitude: -111.87415558730642 }

const calculateAngle = (location, destination) => {
  console.log("location:", location.coords);
  console.log("destination:", destination);
  rise = destination.latitude - location.coords.latitude
  run = destination.longitude - location.coords.longitude
  console.log("rise:", rise);
  console.log("run:", run);
  angleInRad = Math.atan2(rise, run)
  console.log("angle in rad:", angleInRad);
  angleInDeg = angleInRad * 180 / Math.PI

  console.log("calculated angle:", angleInDeg);
  return angleInDeg.toString();
}

const Home = () => {

  const [location, setLocation] = useState();
  const [angle, setAngle] = useState("0");

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != 'granted') {
        console.log("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setAngle(calculateAngle(currentLocation, TACO_BELL))
    };
    getPermissions();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: 'White' }}>
      <Text>Taco Compass</Text>
      <Arrow angle={angle} />
      <Text>t</Text>
    </View>
  )
}

export default Home;
