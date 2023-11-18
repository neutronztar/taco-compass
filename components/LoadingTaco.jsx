import React, { useState, useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import Taco from '../svg/Taco';

// A rotating taco to indicate loading
const LoadingTaco = () => {
    const [rotateAnimation] = useState(new Animated.Value(0)); // Start at no rotation

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.linear,
            })
        ).start();
    }, []);

    const rotation = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                transform: [{ rotate: rotation }],
            }}
        >
            {/* we wrap the SVG in a view that preserves its aspect ratio */}
            <View
                style={{
                    aspectRatio: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Taco width="50%" height="50%" />
            </View>
        </Animated.View>
    );
};

export default LoadingTaco;
