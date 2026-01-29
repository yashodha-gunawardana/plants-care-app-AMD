import { useState } from "react"
import { 
    Alert, View, StyleSheet, Text, TouchableOpacity, 
    KeyboardAvoidingView, Platform, ScrollView, TextInput 
} from "react-native";
import { createPlant } from "@/services/plantService";
import DashboardHeader from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

const AddPlantScreen = () => {

    const [plantPhoto, setPlantPhoto] = useState<string | null>(null); 
    const [plantName, setPlantName] = useState("");
    const [plantType, setPlantType] = useState("");
    const [location, setLocation] = useState("");
    const [waterDays, setWaterDays] = useState("");
    const [light, setLight] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [notes, setNotes] = useState("");


    // camera permission
    const pickImage = async () => {
        
    }
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


    // chip section
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

                    {/* photo uplaod */}
                    <TouchableOpacity style={styles.photoUpload}>
                        <Ionicons name="camera" size={32} color="#3d5a2d" />
                        <Text style={styles.photoText}>Add Photos</Text>
                    </TouchableOpacity>

                    {/* input fields */}
                    <Text style={styles.label}>Plant Name *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Peace Lily"
                        value={plantName}
                        onChangeText={setPlantName}
                    />

                    <Text style={styles.label}>Scientific Name (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Spathiphyllum"
                        value={plantType}
                        onChangeText={setPlantType}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Balcony"
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Water (Days) *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="7"
                                keyboardType="numeric"
                                value={waterDays}
                                onChangeText={setWaterDays}
                            />
                        </View>
                    </View>

                    <SelectionRow
                        label="Light Requirement"
                        options={["Low", "Medium", "Bright", "Direct"]}
                        current={light}
                        setter={setLight}
                    />

                    <SelectionRow
                        label="Care Difficulty"
                        options={["Easy", "Moderate", "Hard"]}
                        current={difficulty}
                        setter={setDifficulty}
                    />

                    <Text style={styles.label}>Soil Type / Notes</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="e.g. Well-draining soil..."
                        multiline
                        value={notes}
                        onChangeText={setNotes}
                    />

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* button */}
            <View style={styles.sideActionContainer}>
                <TouchableOpacity
                    style={styles.verticalBtn}
                    onPress={handleAddPlant}
                    activeOpacity={0.8}>

                    <Ionicons name="add-circle" size={28} color="#1A3C34" />
                    <Text style={styles.verticalBtnText}>SAVE</Text>
                </TouchableOpacity>
            </View>
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
    photoUpload: {
        height: 120,
        backgroundColor: "#f3f4f0",
        borderRadius: 16,
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#c2c5bb",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    photoText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#3d5a2d",
        marginTop: 4,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        fontSize: 14,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    textArea: { height: 80, textAlignVertical: "top" },

    // button
    sideActionContainer: {
        position: "absolute",
        right: 0,
        top: "45%",
        backgroundColor: "#C6F062",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 10,
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: "#1A3C34",
    },
    verticalBtn: {
        paddingVertical: 20,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    verticalBtnText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#1A3C34",
        letterSpacing: 0.5,
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


export default AddPlantScreen;
