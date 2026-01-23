import React, { useEffect, useRef, useState } from "react";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Dimensions, Easing, Platform, StatusBar, TouchableOpacity, StyleSheet, View } from "react-native";



const { width, height } = Dimensions.get("window");

const STATUSBAR_HEIGHT = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

const RAIN_DROP_COUNT = 15;


export default function GardinoAuth() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

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
    const errorShake = useRef(new Animated.Value(0)).current;

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
                    useNativeDriver: true

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
            useNativeDriver: true

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
        const isAuthenticated = Math.random() > 0.5; 

        if (isAuthenticated) {
            setIsSuccess(true);
            Animated.parallel([
                Animated.timing(successFade, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true
                }),
                Animated.spring(plantGrow, {
                    toValue: 1,
                    friction: 4,
                    tension: 10,
                    useNativeDriver: true
                })
            ]).start();

        } else {
            setIsError(true);
            Animated.parallel([
                Animated.timing(successFade, { 
                    toValue: 1, 
                    duration: 400, 
                    useNativeDriver: true 
                }),
                Animated.spring(errorShake, { 
                    toValue: 1, 
                    friction: 3, 
                    tension: 40, 
                    useNativeDriver: true 
                })
            ]).start();
        }
    };


    // rotate blob animation
    const spin = blobRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });


    // social button
    const SocialIcon = ({
        platform,
        iconName,
        color,
        bgColor,
        plantIcon, 
        iconType = "ionicons"
    }: any) => {

        const isActive = activeSocial === platform;

        return (
            <TouchableOpacity
                onPress={() => {
                    setActiveSocial(platform);

                    Animated.sequence([
                        Animated.timing(socialScale, {
                            toValue: 0.9,
                            duration: 100,
                            useNativeDriver: true
                        }),
                        Animated.timing(socialScale, {
                            toValue: 1,
                            duration: 100,
                            useNativeDriver: true
                        })

                    ]).start(() => setActiveSocial(null))
                }}
                activeOpacity={0.8}
                style={styles.socialIconWrapper}>

                <Animated.View 
                    style={[
                        styles.socialCircle,
                        isActive && styles.socialCircleActive, { 
                            backgroundColor: isActive ? color : bgColor, 
                            transform: [{ scale: isActive ? socialScale : 1 }], 
                            borderColor: isActive ? color : '#E8EFE8' 
                        }
                    ]}>
                
                    {iconType === 'ionicons' ? (
                        <Ionicons name={iconName} size={22} color={isActive ? "#FFF" : color} />
                    ) : (
                        <FontAwesome5 name={iconName} size={20} color={isActive ? "#FFF" : color} />
                    )}

                    <View style={[styles.plantBadge, { backgroundColor: isActive ? "#FFF" : bgColor }]}>
                        <MaterialCommunityIcons name={plantIcon} size={12} color={isActive ? color : '#8A9A5B'} />
                    </View>

                </Animated.View>
            </TouchableOpacity>
        );
    };
}


const styles = StyleSheet.create({
    // social login 
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 15, gap: 10 },
    smallLine: { height: 1, flex: 1, backgroundColor: '#D1DCC9' },
    socialText: { fontSize: 11, color: '#A0B0A0', fontWeight: '700', textTransform: 'uppercase' },
    socialCircleRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
    socialIconWrapper: { alignItems: 'center' },
    socialCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 2, position: 'relative', elevation: 3 },
    socialCircleActive: { shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    plantBadge: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', elevation: 2 },
});


