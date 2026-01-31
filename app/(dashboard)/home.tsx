import { PlantContext } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useRef } from "react";
import { Dimensions, Animated } from "react-native";


// get screen dimensions for initial placement of the draggable button
const { width, height } = Dimensions.get("window");


const HomeScreen = () => {
    
    const { plants, loading, fetchPlants } = useContext(PlantContext);
    const router = useRouter();

    // for the entry fade-in effect
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // 'pan' tracks the X and Y animated coordinates
    const pan = useRef(new Animated.ValueXY({ x: width - 85, y: height - 200 })).current;
}