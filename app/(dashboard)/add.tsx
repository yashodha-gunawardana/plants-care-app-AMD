import { useState } from "react"
import { Alert } from "react-native";
import { createPlant } from "@/services/plantService";

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
    }
}