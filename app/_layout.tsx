import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import { PlantProvider } from "@/context/PlantContext";


// root layout for the whole application
const RootLayout = () => {
    const insets = useSafeAreaInsets();

    return ( 
        <View style={{ flex: 1 }}>
            <AuthProvider>
                
                    <SearchProvider>
                        <Stack screenOptions={{ headerShown: false }}>

                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(dashboard)" />

                        </Stack>
                    </SearchProvider>
                
            </AuthProvider>
        </View>
    );
};

export default RootLayout;