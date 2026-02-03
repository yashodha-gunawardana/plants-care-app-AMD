import DashboardHeader from "@/components/Header";
import { PlantContext } from "@/context/PlantContext";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";


const WateringHistoryScreen = () => {
    const router = useRouter();

    const params = useLocalSearchParams();

    // get plantId from url or modal
    const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;

    // get plants data and update function from plantContext
    const { plants, loading, updatePlantData } = useContext(PlantContext);

    // find the relevant plants using id
    const plant = plants.find(p => p.id === plantId);

    
    if (loading) {
        return (
             <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#1A3C34" />
                <Text style={styles.loadingText}>Loading history...</Text>
                <Text style={styles.loadingSubText}>This will only take a moment</Text>
            </View>
        );
    };

    if (!plant) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Plant not found 🌱</Text>
            </View>
        );
    };


    // get the plants watering history
    const wateringHistory = plant.wateringHistory ?? [];


    // delete individual watering history
    const handleDeleteLog = (logDate: string) => {
        Alert.alert(
            "Delete Record",
            "Are you sure, you want to delete this record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        
                        // remove the selected date and create new array
                        const updatedHistory = wateringHistory.filter(item => item !== logDate);
                        await updatePlantData(plant.id!, { 
                            wateringHistory: updatedHistory 
                        });
                    }
                }
            ]
        );
    };


    // delete all watering history
    const handleClearAll = () => {
        Alert.alert(
            "Clear History",
            "This will permanently delete all watering logs, Continue?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: async () => {

                        // empty the array and update firestore
                        await updatePlantData(plant.id!, {
                            wateringHistory: []
                        });
                    }
                }
            ]
        );
    };


    // sort the newest data comes first
    const sortedHistory = [...wateringHistory].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );


    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#D6DED9", "#FFFFFF"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}>
               
            <DashboardHeader />

            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() =>
                            router.replace("/(dashboard)/home")}
                            style={styles.backBtn}>
                    
                        <Ionicons name="arrow-back" size={24} color="#1A3C34" />

                        <Text style={styles.title}>{plant.name}</Text>
                    </TouchableOpacity>
                </View>

                {/* btn clear all */}
                {wateringHistory.length > 0 && (
                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={styles.clearBtn}>
                        
                        <Text style={styles.clearBtnText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            </LinearGradient>
            

        </View>
    );
};


const styles = StyleSheet.create({

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
    },

    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: { padding: 4 },
    title: { fontSize: 24, fontWeight: "800", color: "#1A3C34" },

    clearBtn: { 
        backgroundColor: '#FFF0F0', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 10 
    },
    
    clearBtnText: { color: '#D32F2F', fontWeight: '700', fontSize: 12 },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: "rgba(253, 253, 251, 0.92)", 
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, 
    },
    loadingText: {
        marginTop: 20,
        color: "#1A3C34",
        fontWeight: "800",
        fontSize: 18,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    loadingSubText: {
        marginTop: 5,
        color: "#3d5a2d",
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.7
    },

    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: {  fontSize: 20,  color: "#5DA87A" },

});


export default WateringHistoryScreen;