import React from "react";
import { View } from "react-native";
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


    const renderIcon = () => {
        switch(stage) {
            case "Seed":
                return (
                    <View 
                        style={[styles.seedOuter, {
                            width: iconSize * 0.75,
                            height: iconSize * 0.75,
                            borderRadius: iconSize * 0.375
                        }]}>
                
                        <View
                            style={[styles.seedInner, {
                                width: iconSize * 0.3,
                                height: iconSize * 0.3,
                                borderRadius: iconSize * 0.15
                            }]}>
                        </View>
                    </View>
                );
            
            case "Sprout":
                return (
                    <>
                        {/* main vertical stem */}
                        <View
                            style={[styles.sproutStem, {
                                width: iconSize * 0.1,
                                height: iconSize * 0.7
                            }]}
                        />

                        {/* left leaf at an angle */}
                        <View 
                            style={[styles.sproutLeaf, styles.sproutLeafLeft, { 
                                width: iconSize * 0.25, 
                                height: iconSize * 0.25, 
                                borderRadius: iconSize * 0.125 
                            }]} 
                        />

                        {/* right leaf at opposite angle */}
                        <View 
                            style={[styles.sproutLeaf, styles.sproutLeafRight, { 
                                width: iconSize * 0.25,
                                height: iconSize * 0.25,
                                borderRadius: iconSize * 0.125,
                            }]} 
                        />

                        {/* top bud of the sprout */}
                        <View 
                            style={[styles.sproutTop, { 
                                width: iconSize * 0.4,     
                                height: iconSize * 0.4,
                                borderRadius: iconSize * 0.2, 
                            }]} 
                        />
                    </>
                );
        }
    }
}
