import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"

const RootLayout = () => {
    const insets = useSafeAreaInsets();

    return ( 
        <View style={{ marginTop: insets.top, flex: 1 }}>
            
            <Stack screenOptions={{ headerShown: false }}>

                <Stack.Screen name="index" />

            </Stack>

            
        </View>
    )
}