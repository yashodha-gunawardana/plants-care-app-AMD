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
            
            // animate toast IN (fade + slide up)
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();

        } else {

            // animate toast OUT (fade + slide down)
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;


    const icon =
        type === "success"
            ? "checkmark-circle"
        : type === "error"
            ? "close-circle"
        : "information-circle";


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
