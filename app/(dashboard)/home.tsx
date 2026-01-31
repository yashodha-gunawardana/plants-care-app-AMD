import { PlantContext } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Animated, PanResponder } from "react-native";


// get screen dimensions for initial placement of the draggable button
const { width, height } = Dimensions.get("window");


const HomeScreen = () => {
    
    const { plants, loading, fetchPlants } = useContext(PlantContext);
    const router = useRouter();

    // for the entry fade-in effect
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // 'pan' tracks the X and Y animated coordinates
    const pan = useRef(new Animated.ValueXY({ x: width - 85, y: height - 200 })).current;

    // 'lastOffset' stores the static position where the user stopped dragging
    const lastOffset = useRef({ x: width - 85, y: height - 200 });


    useEffect(() => {
        // keep lastOffset synchronized with the animated value to prevent jumping
        const listenerId = pan.addListener((value) => {
            lastOffset.current = value;
        });
        return () => {
            pan.removeListener(listenerId);
        };
    }, []);


    // PanResponder handles the touch gestures
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                // when touched set the start point to the last known location
                pan.setOffset({
                    x: lastOffset.current.x,
                    y: lastOffset.current.y
                });
                pan.setValue({ x: 0, y: 0 });  // reset movement delta for the new gesture
            },

            // update pan values as the finger moves
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),

            // when released merge the offset so the button stays at the new spot
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;


    const [sortType, setSortType] = useState<'newest' | 'alphabetical'>('newest');

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true
            
        }).start();
    }, []);
}