import { Stack, useRouter } from 'expo-router';
import { Text, SafeAreaView, TouchableOpacity, Linking } from 'react-native';

import ScreenHeaderBtn from '../components/ScreenHeaderBtn';
import Left from '../svg/Left';
import PayPal from '../svg/PayPal';
import COLORS from '../style/colors';

const Info = () => {
    const router = useRouter();

    const handlePress = () => {
        Linking.openURL(
            'https://www.paypal.com/donate/?hosted_button_id=9R7DXG8WPN3G8'
        );
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
                            Icon={Left}
                            handlePress={() => router.back()}
                        />
                    ),
                    headerTitle: '',
                    headerTitleAlign: 'center',
                }}
            />

            <TouchableOpacity
                onPress={handlePress}
                style={{
                    backgroundColor: COLORS.paypal,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                    padding: 20,
                    flexDirection: 'row',
                }}
            >
                <PayPal width="30" height="30" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 20 }}>Buy me a Taco</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Info;
