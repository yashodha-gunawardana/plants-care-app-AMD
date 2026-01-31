import { PlantContext } from "@/context/PlantContext";
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

    
}


const styles = StyleSheet.create({

    center: { flex: 1, justifyContent: "center", alignItems: "center" },
})