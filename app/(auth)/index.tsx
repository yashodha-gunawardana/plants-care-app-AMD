import React from "react";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");

type PlantStage = "Seed" | "Sprout" | "Leaf" | "Bud" | "Flower" | "Tree";


// interface to structure the data for each growth stage
interface StageInfo {
    name: PlantStage
    icon: PlantStage
}

// custome icon component props
interface IconProps {
    stage: PlantStage
    size?: number
}

// order of plant growth
const PLANT_STAGES: StageInfo[] = [
    { name: "Seed", icon: "Seed" },
    { name: "Sprout", icon: "Sprout" },
    { name: "Leaf", icon: "Leaf" },
    { name: "Bud", icon: "Bud" },
    { name: "Flower", icon: "Flower" },
    { name: "Tree", icon: "Tree" },
];

// plantIcon component
const PlantIcon: React.FC<IconProps> = ({ stage, size = 32 }) => {
    const iconSize = size
    const containerStyle = {
        width: iconSize,
        height: iconSize,
        alignItems: "center" as const,
        justifyContent: "center" as const
    };
    
}
