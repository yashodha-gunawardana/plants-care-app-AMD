import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { Animated, Dimensions, Easing, Platform, StatusBar } from "react-native";



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
    const tabIndicatorX = useRef(new Animated.Value(0)).current;   // move tab slider between login/ register
    const blobRotate = useRef(new Animated.Value(0)).current; 
    const nameFieldOpacity = useRef(new Animated.Value(0)).current; 
    const nameFieldTranslateY = useRef(new Animated.Value(-15)).current; 
    const socialScale = useRef(new Animated.Value(1)).current; 
    const plantGrow = useRef(new Animated.Value(0)).current; 
    const successFade = useRef(new Animated.Value(0)).current; 

    // animation values for rain drop
    const rainAnims = useRef([...Array(RAIN_DROP_COUNT)].map(() => new Animated.Value(0))).current;


    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.spring(slideUp, {
                toValue: 0,
                friction: 8,
                useNativeDriver: true
            }),

            Animated.loop(
                Animated.timing(blobRotate, {
                    toValue: 1,
                    duration: 35000,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            )

        ]).start();


        // rain drop animate
        rainAnims.forEach((anim) => {
            const runAnimation = () => {
                anim.setValue(0);
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 1500 + Math.random() * 1500,
                    delay: Math.random() * 3000,
                    easing: Easing.linear,
                    useNativeDriver: true,

                    // loop the animation
                }).start(() => runAnimation());
            }
            runAnimation();
        })
    }, []);


    // switching login / register
    useEffect(() => {
        Animated.spring(tabIndicatorX, {
            toValue: isLogin ? 0 : (width - 80) / 2,
            friction: 7,
            useNativeDriver: true,

        }).start();

        // show name field in register form
        const toValue = isLogin ? 0 : 1;
        Animated.parallel([
            Animated.timing(nameFieldOpacity, {
                toValue,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.timing(nameFieldTranslateY, {
                toValue: isLogin ? -15 : 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start();

    }, [isLogin]);


    // button handler in login / register
    const handleMainAction = () => {
        
    }
}

