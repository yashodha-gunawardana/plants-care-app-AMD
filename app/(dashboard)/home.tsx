import DashboardHeader from "@/components/Header";
import { PlantContext } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Animated, PanResponder, Alert, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


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


    // calculate Garden Health Stats (Next watering time and Light percentage)
    const bentoStats = useMemo(() => {
        if (plants.length === 0) return { water: "N/A", light: "0%", isUrgent: false };
        const now = new Date();
    
        const nextWateringTimes = plants.map(p => {
            const sched = p.careSchedules?.watering;
            if (!sched || !sched.selectedTime) return null;
        
            const [hours, minutes] = sched.selectedTime.split(':').map(Number);
            const target = new Date();
            target.setHours(hours, minutes, 0, 0);
        
            // if time passed today, look at the next scheduled interval day
            if (target < now) target.setDate(target.getDate() + (sched.interval || 1));
            return target.getTime();

        }).filter((t): t is number => t !== null);

        const soonest = nextWateringTimes.length > 0 ? Math.min(...nextWateringTimes) : null;
        const diffInHours = soonest ? Math.round((soonest - now.getTime()) / (1000 * 60 * 60)) : null;
    
        // calculate what % of plants have a light schedule set
        const lightAvg = Math.round((plants.filter(p => p.careSchedules?.light).length / plants.length) * 100);

        return {
            water: diffInHours === null ? "None" : diffInHours <= 0 ? "Due" : `${diffInHours}h`,
            light: `${lightAvg}%`,
            isUrgent: diffInHours !== null && diffInHours <= 0 // highlight if watering is overdue
        };
    }, [plants]);


    // sort the plant list based on user preference
    const sortedPlants = useMemo(() => {
        const list = [...plants];
        if (sortType === "alphabetical") return list.sort((a, b) => a.name.localeCompare(b.name));
        return list.reverse(); 

    }, [plants, sortType]);

    const handleSortPress = () => {
        Alert.alert("Sort Collection", "Choose viewing preference", [
            { text: "Newest First", onPress: () => setSortType("newest") },
            { text: "Alphabetical (A-Z)", onPress: () => setSortType("alphabetical") },
            { text: "Cancel", style: "cancel" },
        ]);
    };


    return (
        <View style={styles.container}>
            <DashboardHeader />

            <SafeAreaView style={{ flex: 1 }}>

            </SafeAreaView>
        </View>
    );
}


const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#F8F9F8" },
    
});