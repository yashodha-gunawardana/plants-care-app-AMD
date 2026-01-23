import React, { useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { Animated, Dimensions, Platform, StatusBar } from "react-native";



const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

const RAIN_DROP_COUNT = 15;


export default function GardinoAuth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");

    const [activeSocial, setActiveSocial] = useState<string | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current; 
    const slideUp = useRef(new Animated.Value(30)).current; 

    // move tab slider between login/ register
    const tabIndicatorX = useRef(new Animated.Value(0)).current; 
    const blobRotate = useRef(new Animated.Value(0)).current; 
    const nameFieldOpacity = useRef(new Animated.Value(0)).current; 
    const nameFieldTranslateY = useRef(new Animated.Value(-15)).current; 
    const socialScale = useRef(new Animated.Value(1)).current; 
    const plantGrow = useRef(new Animated.Value(0)).current; 
    const successFade = useRef(new Animated.Value(0)).current; 

}

