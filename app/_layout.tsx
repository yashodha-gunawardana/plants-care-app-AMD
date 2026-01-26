import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"

// root layout for the whole application
const RootLayout = () => {
    const insets = useSafeAreaInsets();

    return ( 
        <View style={{ flex: 1 }}>
            
            <Stack screenOptions={{ headerShown: false }}>

                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(dashboard)" />

            </Stack>

        </View>
    );
};

export default RootLayout;