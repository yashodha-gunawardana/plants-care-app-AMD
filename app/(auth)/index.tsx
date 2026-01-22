import { TabActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, View, Text } from "react-native";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(30)).current;


    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,  // use GPU for smoother 60fps performance
            }),

            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }),

        ]).start();

    }, []);


    return (
        <View className="flex-1 bg-[#0e1410]">
            <ImageBackground source={{ uri: "https://i.pinimg.com/1200x/c8/aa/08/c8aa087994998899f569a74367a9ffd0.jpg"}} className="flex-1">
                <View className="absolute inset-0 bg-[#0a140f]/55"></View>

                <Animated.View
                    style={{
                        marginTop: height * 0.15,
                        opacity: fadeAnim,
                        transform: [{ translateY: translateAnim }]
                    }}
                    className="items-center">

                    <Text className="text-[90Px] font-serif font-medium text-[#f4f7f2] shadow-black shadow-lg">
                        Gardino
                    </Text>

                </Animated.View>
            </ImageBackground>

        </View>
    )
}