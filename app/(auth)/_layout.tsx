import { Stack } from "expo-router"

// layout for authentication-related screens
const AuthLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>

            <Stack.Screen name="index" />
            <Stack.Screen name="loginRegister" />

        </Stack>
    );
};

export default AuthLayout;