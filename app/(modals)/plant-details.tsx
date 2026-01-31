import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Dimensions, StyleSheet, View, Text, Alert } from "react-native";



const { width, height } = Dimensions.get("window");

const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/736x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantDetailsModal = () => {

    // retrieve the plant ID from the URL parameters
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { plants, removePlant } = useContext(PlantContext);

    // find the specific plant object that matches the ID from the URL
    const plant = plants.find((p) => p.id === id);

    // if no plant is found, show message
    if (!plant) {
        return (
            <View style={styles.center}>
                <Text>Plant not found</Text>
            </View>
        );
    }


    // handle plants delete
    const handleDelete = () => {
        Alert.alert(
            "Delete Plant",
            `Are you sure you want to remove  ${plant.name}?`,[
                { text: "Cancel", style: "cancel"},
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // remove from global state
                        await removePlant(plant.id!);
                        router.back();
                    }
                }
        ]);
    };


    // reusable component for care items
    const CareRow = ({ icon, label, value, isMaterial = false }: any) => (
        <View style={styles.careRow}>
            <View style={styles.careIconBox}>
                {isMaterial ? (
                    <MaterialCommunityIcons name={icon} size={24} color="#1A3C34" />
                ) : (
                    <Ionicons name={icon} size={24} color="#1A3C34" />
                )}
            </View>

            <View style={styles.careTextContainer}>
                <Text style={styles.careLabel}>{label}</Text>
                <Text style={styles.careValue}>{value}</Text>
            </View>
        </View>
    );


    // format the interval numbers into human-readable text
    const getCareValue = (type: keyof Required<Plant>['careSchedules'], unit: string) => {
        const schedule = plant.careSchedules?.[type];
        if (!schedule || !schedule.interval || schedule.interval === 0) return "Not scheduled";
        
        const interval = schedule.interval;
        if (interval === 1 && unit === "day") return `Daily`;
        if (interval === 7 && unit === "day") return `Once a week`;
        return `Every ${interval} ${unit}${interval > 1 ? "s" : ""}`; // handles pluralization
    };


    const imageSource = plant.photo ? { uri: plant.photo } : { uri: DEFAULT_PLANT_IMAGE };
}


const styles = StyleSheet.create({

    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    careRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

    careIconBox: {
        width: 58,
        height: 58,
        backgroundColor: "#F4F6F4",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 18,
    },

    careTextContainer: { flex: 1 },
    careLabel: { fontSize: 18, fontWeight: "800", color: "#1A3C34" },
    careValue: { fontSize: 14, color: "#7A8A7A", marginTop: 2, fontWeight: "500" },
})