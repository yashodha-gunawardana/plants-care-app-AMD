import { TabActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, View, Text, Pressable } from "react-native";

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

                    <View className="w-[220px] border-t-4 border-dotted border-[#f4f7f2]/60 my-4"></View>

                    <Text className="text-lg font-medium tracking-widest text-[#f4f7f2] opacity-90">
                        Plants Care Made Simple
                    </Text>

                </Animated.View>

                <Animated.View
                    style={{ 
                        opacity: fadeAnim, 
                        transform: [{ translateY: translateAnim }] 
                    }}
                    className="absolute bottom-[60px] w-full px-9">
                    
                    <Pressable
                        onPress={() => router.push("/(auth)/login")}
                        className="active:scale-[0.92] overflow-hidden rounded-full">
                    </Pressable>

                    <BlurView 
                        intensity={30} 
                        tint="dark" 
                        className="h-[70px] flex-row items-center justify-between pl-8 pr-2 bg-[#2b4736]/60 border border-white/15">
                    </BlurView>

                    <Text className="text-lg font-semibold tracking-wide text-[#f4f7f2]">
                        Get Started
                    </Text>
                </Animated.View>
            </ImageBackground>

        </View>
    )
}