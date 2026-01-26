import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Easing, View, Text, ImageBackground, SafeAreaView, PanResponder } from "react-native";
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
                                            { translateY: (iconSize * 0.4) * Math.sin((angle * Math.PI) / 180) },

                                        ],
                                        backgroundColor: index % 2 === 0 ? "#f080b8" : "#FFC0CB" 
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
const WelcomeScreen = () => {
    const router = useRouter();

    const glideX = useRef(new Animated.Value(0)).current;
    const pan = useRef(new Animated.Value(0)).current;
    
    // current plant stage
    const [currentStage, setCurrentStage] = useState<number>(0);

    const trackWidth = width > 500 ? 320 : width * 0.85;
    const travelDistance = trackWidth - 60 - 12;  // total travel distance for icon


    const panResponder = useRef(
        PanResponder.create({
            // always allow starting drag
            onStartShouldSetPanResponder: () => true,

            // always allow movement drag
            onMoveShouldSetPanResponder: () => true,

            // when user moves finger
            onPanResponderMove: (_, gestureState) => {
                // (0 to travelDistance)
                let newX = Math.max(0, Math.min(gestureState.dx, travelDistance));
                pan.setValue(newX);
            },

            // when user lifts finger
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx >= travelDistance * 0.9) {
                    router.push("/(auth)/loginRegister");
                }

                Animated.spring(pan, {
                    toValue: 0,
                    useNativeDriver: true

                }).start();
            },
        })

    ).current;


    useEffect(() => {
        // track movement using pan
        const listenerId = pan.addListener(({ value }) => {
            const progerss = value / travelDistance;

            const stageIndex = Math.min(
                Math.floor(progerss * PLANT_STAGES.length),
                PLANT_STAGES.length - 1
            );

            setCurrentStage(stageIndex);
        });

        return () => pan.removeListener(listenerId);
    }, []);
    
    
    // get current stage
    const currentStageInfo = PLANT_STAGES[currentStage] || PLANT_STAGES[0];


    return (
        <View style={styles.container}>
            <ImageBackground 
                source={{ uri: 'https://i.pinimg.com/1200x/c8/aa/08/c8aa087994998899f569a74367a9ffd0.jpg' }} 
                style={StyleSheet.absoluteFillObject}>
            

                <View style={styles.overlay} />

                {/* main content */}
                <SafeAreaView style={styles.contentWrapper}>

                    {/* title */}
                    <View style={styles.textContainer}>
                        <View style={styles.masterLogoWrapper}>

                            {/* design for letter "G" */}
                            <View style={styles.gSculptedWrapper}>
                                <View style={styles.gBackglow} />
                            
                                <View style={styles.gLetterContainer}>
                                    <Text style={styles.titleG}>G</Text>
                                </View>

                                {/* leaf design overlaying the G */}
                                <View style={styles.sculptedLeafContainer}>
                                    <View style={styles.leafShadowLayer} />
                                    <View style={styles.leafMainBody}>
                                        <View style={styles.leafReflectedLight} />
                                    </View>

                                    <View style={styles.dewDropPoint} />
                                </View>
                            </View>

                            <Text style={styles.titleRestText}>ardino</Text>
                        </View>

                        <View style={styles.pulseLineContainer}>
                            <View style={styles.baseLine} />
                            <View style={styles.activePulse} />
                            <View style={styles.pulseNode} />
                        </View>

                        <View style={styles.subtitleWrapper}>
                            <Text style={styles.subtitle}>Elegance in Every Detail</Text>
                            <View style={styles.dot} />
                        </View>
                    </View>

                    {/* button */}
                     <Animated.View style={[styles.buttonContainer]}>
                        <View
                            style={styles.trackShape}
                            {...panResponder.panHandlers}>

                            <BlurView intensity={30} tint="dark" style={styles.blurStyle}>

                                <Animated.View 
                                    style={[
                                        styles.iconCircle, 
                                        { transform: [{ translateX: glideX }] }
                                    ]}>
                                    <PlantIcon stage={currentStageInfo.icon} size={32} />
                                </Animated.View>

                                <View style={styles.textContainerInside}>
                                    <Text style={styles.btnText}>Slide to Bloom</Text>
                                    <Text style={styles.stageText}>
                                        {currentStageInfo.name} 
                                    </Text>
                                </View>

                            </BlurView>
                        </View>
                    </Animated.View> 
                    
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};


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
    gLetterContainer: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5, 
    },
    titleG: {
        fontSize: 110,              
        color: "#f4f7f2",          
        fontFamily: "serif",        
        fontWeight: "200",          
        includeFontPadding: false,  
    },
    sculptedLeafContainer: {
        position: "absolute",       
        top: 20,                    
        left: -15,                  
        width: 35,                 
        height: 35,                 
        zIndex: 10,                 
    },
    leafMainBody: {
        width: "100%",              
        height: "100%",
        backgroundColor: "#8A9A5B", 
        borderTopLeftRadius: 30,    
        borderBottomRightRadius: 30,
        borderWidth: 1,            
        borderColor: "rgba(255,255,255,0.4)", 
        transform: [{ rotate: "-15deg" }], 
    },
    leafShadowLayer: {
        position: "absolute",       
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)", 
        borderRadius: 30,
        top: 4,                     
        left: 4,
        transform: [{ rotate: "-15deg" }], 
    },
    leafReflectedLight: {
        width: "50%",               
        height: "15%",              
        backgroundColor: "rgba(255,255,255,0.3)", 
        borderRadius: 20,           
        marginTop: 5,               
        marginLeft: 5,              
    },
    dewDropPoint: {
        position: "absolute",       
        bottom: 2,                  
        right: 5,                   
        width: 6,                   
        height: 6,
        backgroundColor: "#FFF",    
        borderRadius: 3,           
        opacity: 0.8,               
    },
    titleRestText: {
        fontSize: 75,               
        color: "#f4f7f2",
        fontFamily: "serif",
        fontWeight: "200",          
        letterSpacing: -4,          
        marginLeft: -5,             
    },

    // bio-pulse underline 
    pulseLineContainer: {
        width: 220,                 
        height: 20,                 
        justifyContent: "center",   
        marginTop: -10,             
    },
    baseLine: {
        width: "100%",              
        height: 0.5,                
        backgroundColor: "rgba(244, 247, 242, 0.2)", 
    },
    activePulse: {
        position: "absolute",       
        width: 80,                  
        height: 1,                  
        backgroundColor: "#8A9A5B", 
        left: "10%",                
    },
    pulseNode: {
        position: "absolute",
        width: 4,                   
        height: 4,
        backgroundColor: "#8A9A5B", 
        borderRadius: 2,            
        left: "10%",                
        shadowColor: "#8A9A5B",     
        shadowRadius: 5,            
        shadowOpacity: 1,           
    },

    // subtitle
    subtitleWrapper: {
        flexDirection: "row",       
        alignItems: "center",       
        marginTop: 5,              
    },
    subtitle: {
        fontSize: 14,               
        color: "#f4f7f2",
        opacity: 0.6,               
        letterSpacing: 4,           
        textTransform: "uppercase", 
        fontWeight: "300",          
    },
    dot: {
        width: 4,                   
        height: 4,
        backgroundColor: "#8A9A5B", 
        borderRadius: 2,            
        marginLeft: 10,             
    },

    // button 
    buttonContainer: {
        width: width > 500 ? 320 : "85%",
        marginBottom: 15,           
    },
    trackShape: {
        height: 72,                 
        backgroundColor: "rgba(255, 255, 255, 0.05)", 
        borderTopLeftRadius: 5,     
        borderBottomLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 5,
        overflow: "hidden",         
        borderWidth: 1,             
        borderColor: "rgba(255, 255, 255, 0.2)", 
    },
    blurStyle: {
        flex: 1,                    
        flexDirection: "row",       
        alignItems: "center",       
        paddingHorizontal: 6,       
    },
    iconCircle: {
        width: 60,                  
        height: 60,
        backgroundColor: "#f4f7f2", 
        borderRadius: 30,           
        justifyContent: "center",   
        alignItems: "center",
        shadowColor: "#000",        
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,              
    },
    textContainerInside: {
        position: "absolute",       
        width: "100%",              
        alignItems: "center",       
        zIndex: -1,                 
    },
    btnText: {
        color: "#f4f7f2",
        fontSize: 16,
        fontWeight: "600",          
        letterSpacing: 1,          
        opacity: 0.7,               
    },
    stageText: {
        color: "#f4f7f2",
        fontSize: 12,               
        opacity: 0.5,               
        marginTop: 4,               
        fontWeight: "500",          
    },

    // plant icon color 
    seedOuter: {
        backgroundColor: "#5D4037", 
        alignItems: "center",
        justifyContent: "center",
    },
    seedInner: {
        backgroundColor: "#795548", 
    },
    sproutStem: {
        backgroundColor: "#4A5F3A", 
        position: "absolute",
    },
    sproutLeaf: {
        backgroundColor: "#6B8E57", 
        position: "absolute",
        top: "30%",                 
    },
    sproutLeafLeft: {
        left: 0,                    
        transform: [{ rotate: "-30deg" }], 
    },
    sproutLeafRight: {
        right: 0,                   
        transform: [{ rotate: "30deg" }],  
    },
    sproutTop: {
        backgroundColor: "#4A5D23", 
        position: "absolute",
        top: 0,                     
    },
    leafShape: {
        backgroundColor: "#8A9A5B", 
    },
    leafStem: {
        backgroundColor: "#556B2F", 
        position: "absolute",
        bottom: 0,                  
    },
    budOuter: {
        backgroundColor: "#C2185B", 
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    budInner: {
        backgroundColor: "#E91E63", 
    },
    flowerCenter: {
        backgroundColor: "#FF9800", 
        position: "absolute",
    },
    flowerPetal: {
        position: "absolute",
        backgroundColor: "#ff91bb", 
    },
    treeTrunk: {
        backgroundColor: "#3E2723", 
        position: "absolute",
        bottom: 0,                  
    },
    treeTop: {
        backgroundColor: "#1B5E20", 
        position: "absolute",
        top: 0,                     
    },
});


export default WelcomeScreen;