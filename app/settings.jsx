import { Stack, useRouter } from 'expo-router';
import { Text, SafeAreaView } from 'react-native';

import ScreenHeaderBtn from '../components/ScreenHeaderBtn';
import Left from '../svg/Left';
import COLORS from '../style/colors';

const Settings = () => {
    const router = useRouter();

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
                    headerTitle: 'Settings',
                    headerTitleAlign: 'center',
                }}
            />
            <Text>There are no settings, just go eat some tacos.</Text>
        </SafeAreaView>
    );
};

export default Settings;
