import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, Dimensions } from "react-native";



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


    const config = {
        success: { icon: "shield-checkmark", color: "#2DD4BF" },
        error: { icon: "bug", color: "#FB7185" },
        info: { icon: "sparkles", color: "#818CF8" },
    };

    const { icon, color } = config[type];


    return (
        <Animated.View
            style={[
                styles.toast,
                styles[type],                
                {
                    opacity,                   
                    transform: [{ translateY }],
                },
            ]}>

            {/* Toast icon */}
            <Ionicons name={icon} size={18} color="#fff" />

            {/* Toast message */}
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    toast: {
        position: "absolute",      
        bottom: 40,                
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,          
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        elevation: 10,             
        maxWidth: "85%",
    },

    text: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },

    // success toast
    success: {
        backgroundColor: "#2E7D32",
    },

    // error toast
    error: {
        backgroundColor: "#C62828",
    },

    // info / neutral toast
    info: {
        backgroundColor: "#1A3C34",
    }
});


export default Toast;
