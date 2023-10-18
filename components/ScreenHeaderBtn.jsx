import React from 'react';
import { TouchableOpacity } from 'react-native';

const ScreenHeaderBtn = ({ Icon, handlePress }) => {
    return (
        <TouchableOpacity
            style={{
                width: 40,
                height: 40,
                borderRadius: 9,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={handlePress}
        >
            <Icon />
        </TouchableOpacity>
    );
};

export default ScreenHeaderBtn;
