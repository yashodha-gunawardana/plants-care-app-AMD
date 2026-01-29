import { useState } from "react"
import { Alert, View, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { createPlant } from "@/services/plantService";
import DashboardHeader from "@/components/Header";

const AddPlantScreen = () => {

    const [plantName, setPlantName] = useState("");
    const [plantType, setPlantType] = useState("");
    const [location, setLocation] = useState("");
    const [waterDays, setWaterDays] = useState("");
    const [light, setLight] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [notes, setNotes] = useState("");


    // save handler
    const handleAddPlant = async () => {

        if (!plantName || !waterDays || !light || !difficulty) {
            Alert.alert(
                "Missing Info",
                "Please provide a name, watering frequency, light, and difficulty."
            );
            return;
        }

        try {
            await createPlant({
                name: plantName,
                scientificName: plantType,
                location: location || "Living Room",
                waterEvery: Number(waterDays),
                lightRequirement: light,
                careDifficulty: difficulty,
                notes: notes,
                lastWatered: new Date().toISOString(),
            });

            Alert.alert("Success 🌱", `${plantName} has been added!.`);

            setPlantName("");
            setPlantType("");
            setLocation("");
            setWaterDays("");
            setLight("");
            setDifficulty("");
            setNotes("");

        } catch (err) {
            Alert.alert("Error", "Failed to save plant. Please try again.");
            console.log(err);
        }
    };


    {/* chip selection */}
    const SelectionRow = ({ label, options, current, setter }: any) => (
        <View style={styles.section}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.chipRow}>
                {options.map((opt: string) => (
                    <TouchableOpacity
                        key={opt}
                        // apply active style if selected
                        style={[styles.chip, current === opt && styles.activeChip]}
                        onPress={() => setter(opt)}>

                        <Text
                            style={[styles.chipText, current === opt && styles.activeChipText]}>
                                {opt}

                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <DashboardHeader />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>

                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>

                    <Text style={styles.title}>Add New Plant 🌿</Text>
                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    );
};


const styles = StyleSheet.create({
    // screen
    container: { flex: 1, backgroundColor: "#fdfdfb" },
    content: { padding: 20 },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A3C34",
        marginBottom: 20,
    },


    // chip section
    section: { marginBottom: 16 },
    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#3d5a2d",
        marginBottom: 6,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#eee",
        borderWidth: 1,
        borderColor: "transparent",
    },
    activeChip: { backgroundColor: "#C6F062", borderColor: "#1A3C34" },
    chipText: { fontSize: 12, color: "#666" },
    activeChipText: { color: "#1A3C34", fontWeight: "700" }

});
