import React, { useEffect, useRef, useState } from "react";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Dimensions, Easing, Platform, StatusBar, TouchableOpacity, StyleSheet, View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView} from "react-native";


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


    return (
        <View style={styles.masterContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* bg layer with rain animation */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                {rainAnims.map((anim, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.raindrop, {
                                // distribute raindrops across screen width
                                left: (width / RAIN_DROP_COUNT) * i + (Math.random() * 20),
                                opacity: anim.interpolate({
                                    inputRange: [0, 0.2, 0.8, 1],
                                    outputRange: [0, 0.15, 0.15, 0]
                                }),
                                // move from top to bottom of screen
                                transform: [
                                    { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-100, height + 100] }) },
                                    { rotate: "15deg" }
                                ] 
                            }
                        ]}>
                    </Animated.View>
                ))}
            </View>

            {/* success screen */}
            {isSuccess && (
                <Animated.View style={[styles.successOverlay, { opacity: successFade }]}>
                <Animated.View style={{ transform: [{ scale: plantGrow }] }}>
                    <MaterialCommunityIcons name="sprout" size={100} color="#2D5A27" />
                </Animated.View>
                <Text style={styles.successTitle}>Welcome to Gardino!</Text>
                <Text style={styles.successSubtitle}>Your garden is starting to grow...</Text>
                <TouchableOpacity style={[styles.mainBtn, { width: 200, marginTop: 40 }]} onPress={() => setIsSuccess(false)}>
                    <Text style={styles.mainBtnText}>Continue</Text>
                </TouchableOpacity>
                </Animated.View>
            )}

            {/* error screen */}
            {isError && (
                <Animated.View style={[styles.errorOverlay, { opacity: successFade }]}>
                <Animated.View style={{ transform: [{ scale: errorShake }] }}>
                    <MaterialCommunityIcons name="leaf-off" size={100} color="#8B4513" />
                </Animated.View>
                <Text style={styles.errorTitle}>Growth Stalled</Text>
                <Text style={styles.errorSubtitle}>We couldn't verify your roots. Please check your details and try again.</Text>
                <TouchableOpacity 
                    style={[styles.mainBtn, styles.errorBtn, { width: 200, marginTop: 40 }]} 
                        onPress={() => {
                        setIsError(false);
                        errorShake.setValue(0);
                    }}>
                    <Text style={styles.mainBtnText}>Try Again</Text>
                </TouchableOpacity>
                </Animated.View>
            )}

            <SafeAreaView style={{ flex: 1 }}>
                {(!isSuccess && !isError) && (
                    <>
                        {/* back btn in left top corner */}
                        <TouchableOpacity style={styles.backButton}>
                            <Ionicons name="chevron-back" size={28} color="#1A3026" />
                        </TouchableOpacity>

                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                            <ScrollView 
                                contentContainerStyle={styles.scrollContent} 
                                showsVerticalScrollIndicator={false} 
                                keyboardShouldPersistTaps="handled">
                            </ScrollView>

                        </KeyboardAvoidingView>
                    </>
                )}
            </SafeAreaView>

        </View>
    )
}


const styles = StyleSheet.create({

    // main container
    masterContainer: { flex: 1, backgroundColor: "#F4F7F2" }, 
    backButton: { position: "absolute", top: STATUSBAR_HEIGHT + 25, left: 20, zIndex: 10, padding: 8 },

    raindrop: {
        position: "absolute",
        width: 6,
        height: 10,
        backgroundColor: "#A0B0A0",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 0,
        transform: [{ rotate: "45deg" }] 
    },

    // success screen 
    successOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F4F7F2", zIndex: 100, justifyContent: "center", alignItems: "center", padding: 40 },
    successTitle: { fontSize: 28, fontWeight: "800", color: "#1A3026", marginTop: 20 },
    successSubtitle: { fontSize: 16, color: "#6B8E23", marginTop: 8, textAlign: "center" },

    // error screen
    errorOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FCF8F4", zIndex: 100, justifyContent: "center", alignItems: "center", padding: 40 },
    errorTitle: { fontSize: 28, fontWeight: "800", color: "#5C4033", marginTop: 20 },
    errorSubtitle: { fontSize: 16, color: "#8B4513", marginTop: 8, textAlign: "center", lineHeight: 22 },
    errorBtn: { backgroundColor: "#8B4513", shadowColor: "#5C4033" },

    // main button
    mainBtn: { 
        backgroundColor: "#3A5A40", 
        height: 56, 
        borderTopLeftRadius: 50, 
        borderBottomRightRadius: 32,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 50,
        marginTop: 10, 
        elevation: 4, 
        shadowColor: "#1A3026", 
        shadowOpacity: 0.5, 
        shadowRadius: 15,
        shadowOffset: { width: 4, height: 8 },
        borderTopWidth: 2.5,
        borderLeftWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.25)", 
        overflow: "visible"
    },
    mainBtnText: { 
        color: "#FFF", 
        fontSize: 18, 
        fontWeight: "700", 
        letterSpacing: -0.5,
    },

    // social login 
    dividerRow: { flexDirection: "row", alignItems: "center", marginTop: 15, marginBottom: 15, gap: 10 },
    smallLine: { height: 1, flex: 1, backgroundColor: "#D1DCC9" },
    socialText: { fontSize: 11, color: "#A0B0A0", fontWeight: "700", textTransform: "uppercase" },
    socialCircleRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
    socialIconWrapper: { alignItems: "center" },
    socialCircle: { 
        width: 56, 
        height: 56, 
        borderRadius: 28, 
        justifyContent: "center", 
        alignItems: "center", 
        borderWidth: 2, 
        position: "relative", 
        elevation: 3 
    },
    socialCircleActive: { shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
    plantBadge: { 
        position: "absolute", 
        bottom: -4, 
        right: -4, 
        width: 22, 
        height: 22, 
        borderRadius: 11, 
        justifyContent: "center", 
        alignItems: "center", 
        borderWidth: 2, 
        borderColor: "#FFF", 
        elevation: 2 
    },

});


