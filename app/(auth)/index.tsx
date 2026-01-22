import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Animated } from "react-native";


export default function WelcomeScreen() {
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(30)).current;
}