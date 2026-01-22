import { TabActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";


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
}