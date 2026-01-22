import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Easing, View, ImageBackground, SafeAreaView } from "react-native";
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

            case "Leaf":
                return (
                    <>
                        {/* main leaf body */}
                        <View 
                            style={[styles.leafShape, { 
                                width: iconSize * 0.8,     
                                height: iconSize * 0.8,
                                borderRadius: iconSize * 0.4, 
                            }]} 
                        />

                        {/* small stem connecting leaf */}
                        <View 
                            style={[styles.leafStem, { 
                                width: iconSize * 0.06,    
                                height: iconSize * 0.3,    
                            }]} 
                        />
                    </>
                );

            case "Bud":
                return (
                    <>
                        {/* outer bud shape */}
                        <View 
                            style={[styles.budOuter, { 
                                width: iconSize * 0.6,     
                                height: iconSize * 0.6,
                                borderRadius: iconSize * 0.3, 
                            }]} 
                        />

                        {/* inner bud center */}
                        <View 
                            style={[styles.budInner, { 
                                width: iconSize * 0.3,     
                                height: iconSize * 0.3,
                                borderRadius: iconSize * 0.15,
                            }]} 
                        />
                    </>
                );

            case "Flower": 
                return (
                    <>
                        {/* flower center */}
                        <View
                            style={[styles.flowerCenter, {
                                width: iconSize * 0.4,
                                height: iconSize * 0.4,
                                borderRadius: iconSize * 0.2
                            }]}
                        />

                        {/* 8 petals in 45 degree */}
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                            <View
                                key={angle}
                                style={[
                                    styles.flowerPetal, {
                                        width: iconSize * 0.25,
                                        height: iconSize * 0.25,
                                        borderRadius: iconSize * 0.125,

                                        // cicrle coordinates 
                                        transform: [
                                            { translateX: (iconSize * 0.4) * Math.cos((angle * Math.PI) / 180) },
                                            { translateY: (iconSize * 0.4) * Math.cos((angle * Math.PI) / 180) },

                                        ],
                                        backgroundColor: index % 2 === 0 ? "#FF69B4" : "#FFC0CB" 
                                    }
                                ]}
                            />
                        ))}
                    </>
                );

            case "Tree":
                return (
                    <>
                        {/* tree trunk */}
                        <View 
                            style={[styles.treeTrunk, { 
                                width: iconSize * 0.15,    
                                height: iconSize * 0.7,    
                            }]} 
                        />

                        {/* tree canopy/top */}
                        <View 
                            style={[styles.treeTop, { 
                                width: iconSize * 0.8,     
                                height: iconSize * 0.5,    
                                borderRadius: iconSize * 0.4, 
                            }]} 
                        />
                    </>
                );
      
            default:
               return null;
        }
    };

    return <View style={containerStyle}>{renderIcon()}</View>
};


// welcome screen component
export default function WelcomeScreen() {
    const router = useRouter();

    const glidex = useRef(new Animated.Value(0)).current;
    
    // current plant stage
    const [currentStage, setCurrentStage] = useState<number>(0);

    const trackWidth = width > 500 ? 320 : width * 0.85;
    const travelDistance = trackWidth - 60 - 12;  // total travel distance for icon

    useEffect(() => {
        Animated.loop(
            Animated.sequence([

                // slide icon to the right
                Animated.timing(glidex, {
                    toValue: travelDistance,
                    duration: 3000,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true
                }),

                Animated.delay(1500),  // 1.5 second pause

                // back to start
                Animated.timing(glidex, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true
                }),
            ])
        ).start();


        // update plant stage based on animation progress
        const listenerId = glidex.addListener(({ value }) => {
            const progress = value / travelDistance;

            const stageIndex = Math.min(
                Math.floor(progress * PLANT_STAGES.length),
                PLANT_STAGES.length - 1
            );
            setCurrentStage(stageIndex)
        });

        return () => glidex.removeListener(listenerId)
    }, []);


    // get current stage
    const currentStageInfo = PLANT_STAGES[currentStage] || PLANT_STAGES[0];


    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{ uri: 'https://i.pinimg.com/1200x/c8/aa/08/c8aa087994998899f569a74367a9ffd0.jpg' }} 
                style={StyleSheet.absoluteFillObject}>
            </ImageBackground>

            <View style={styles.overlay} />

            {/* main content */}
            <SafeAreaView style={styles.contentWrapper}>

                {/* title */}
                <View style={styles.textContainer}>
                    <View style={styles.masterLogoWrapper}>

                        {/* design for letter "G" */}
                        <View style={styles.gSculptedWrapper}>
                            <View style={styles.gBackglow} />
                        </View>

                    </View>

                </View>


            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#0e1410"
    },
    overlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },
    contentWrapper: { 
        flex: 1,                    
        alignItems: "center",       
        justifyContent: "space-between", 
        paddingVertical: 80         
    },
    textContainer: {
        alignItems: "center",       
        paddingTop: 40,             
    },
    masterLogoWrapper: {
        flexDirection: "row",       
        alignItems: "baseline",     
    },
    gSculptedWrapper: {
        position: "relative",       
        width: 80,                  
        height: 90,                 
        justifyContent: "center",   
        alignItems: "center",       
    },
    gBackglow: {
        position: "absolute",       
        width: 100,                
        height: 100,
        backgroundColor: "#8A9A5B", 
        borderRadius: 50,          
        opacity: 0.08,              
        filter: "blur(20px)",       
    },
})
