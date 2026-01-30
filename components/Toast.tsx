import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, Dimensions, View, Platform, StatusBar } from "react-native";


type ToastType = "success" | "error" | "info";

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
}

const { width } = Dimensions.get("window");

const Toast = ({ visible, message, type = "info" }: ToastProps) => {
    
    // local state to keep the component mounted during the "fade out" animation
    const [shouldRender, setShouldRender] = useState(visible);
    
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            progress.setValue(0);

            Animated.parallel([
                Animated.spring(scale, { 
                    toValue: 1, 
                    useNativeDriver: true, 
                    friction: 8 
                }),
                Animated.timing(opacity, { 
                    toValue: 1, 
                    duration: 300, 
                    useNativeDriver: true 
                }),
                Animated.timing(progress, { 
                    toValue: 1, 
                    duration: 3000, 
                    useNativeDriver: false 
                })
            ]).start();

        } else {

            Animated.parallel([
                Animated.timing(opacity, { 
                    toValue: 0, 
                    duration: 200, 
                    useNativeDriver: true 
                }),
                Animated.timing(scale, { 
                    toValue: 0.95, 
                    duration: 200, 
                    useNativeDriver: true 
                }),
            ]).start(() => setShouldRender(false));
        }
    }, [visible]);


    // if the toast is hidden and animations finished, return null to save memory
    if (!shouldRender) return null;


    // configuration mapping for icons and colors based on type
    const config = {
        success: { icon: "shield-checkmark", color: "#2DD4BF" },
        error: { icon: "bug", color: "#FB7185" },
        info: { icon: "sparkles", color: "#818CF8" },
    };

    const { icon, color } = config[type];

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });


    return (
        <View style={styles.overlayWrapper} pointerEvents="none">
            <Animated.View
                style={[
                    styles.toastCard,
                    {
                        opacity,
                        transform: [{ scale }],
                    },
                ]}>

                <View style={styles.innerContent}>

                    {/* icon Circle with 20% opacity background of the main color */}
                    <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
                        <Ionicons name={icon as any} size={18} color={color} />
                    </View>
                
                    {/* Toast Message - limited to 2 lines for design consistency */}
                    <Text style={styles.messageText} numberOfLines={2}>
                        {message}
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <Animated.View 
                        style={[
                            styles.progressBar, 
                            { backgroundColor: color, width: progressWidth } 
                        ]} 
                    />
                </View>
            </Animated.View>
        </View>        
    );
};


const styles = StyleSheet.create({
    overlayWrapper: {
        ...StyleSheet.absoluteFillObject, 
        zIndex: 9999,                   
        elevation: 99,                  
        alignItems: "center",           
        justifyContent: "flex-start",   
        paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 20,
    },
    toastCard: {
        width: width * 0.85,
        backgroundColor: "rgba(45, 52, 54, 0.95)", 
        borderRadius: 20,
        overflow: "hidden",             
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)", 
        elevation: 12,
    },
    innerContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    messageText: {
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "600",
        flex: 1,
        letterSpacing: 0.2,
    },
    progressBarContainer: {
        height: 3,
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.05)", 
        position: "absolute",
        bottom: 0,
    },
    progressBar: {
        height: "100%",
    },
});


export default Toast;
