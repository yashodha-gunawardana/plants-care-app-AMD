import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "@/components/Header";

const AddPlantScreen = () => {

  // 🔹 Plant name entered by user
  const [plantName, setPlantName] = useState("");

  // 🔹 Plant type entered by user
  const [plantType, setPlantType] = useState("");

  // 🔹 Plant location (Indoor / Outdoor)
  const [location, setLocation] = useState("");

  // 🔹 Watering interval in days
  const [waterDays, setWaterDays] = useState("");

  // 🔹 Handle Add Plant button
  const handleAddPlant = () => {

    // ❗ Basic validation
    if (!plantName || !plantType || !waterDays) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    // 🔹 Create plant object (this will go to Firebase later)
    const newPlant = {
      id: Date.now().toString(),         // unique id
      name: plantName,
      type: plantType,
      location: location || "Indoor",    // default value
      waterEvery: Number(waterDays),
      lastWatered: new Date().toISOString(), // auto set
      createdAt: new Date().toISOString()
    };

    // 🔍 Temporary log (replace with Firestore later)
    console.log("New Plant Added:", newPlant);

    // 🔹 Clear form after adding
    setPlantName("");
    setPlantType("");
    setLocation("");
    setWaterDays("");

    Alert.alert("Success 🌱", "Plant added successfully!");
  };

  return (
    <View style={styles.container}>

      {/* 🔹 Dynamic dashboard header */}
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔹 Screen title */}
        <Text style={styles.title}>Add New Plant 🌿</Text>

        {/* 🔹 Plant Name */}
        <Text style={styles.label}>Plant Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Aloe Vera"
          value={plantName}
          onChangeText={setPlantName}
        />

        {/* 🔹 Plant Type */}
        <Text style={styles.label}>Plant Type *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Indoor Plant"
          value={plantType}
          onChangeText={setPlantType}
        />

        {/* 🔹 Plant Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Indoor / Outdoor"
          value={location}
          onChangeText={setLocation}
        />

        {/* 🔹 Water Frequency */}
        <Text style={styles.label}>Water Every (Days) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 3"
          keyboardType="numeric"
          value={waterDays}
          onChangeText={setWaterDays}
        />

        {/* 🔹 Submit Button */}
        <TouchableOpacity style={styles.addBtn} onPress={handleAddPlant}>
          <Ionicons name="leaf-outline" size={20} color="#1A3C34" />
          <Text style={styles.addBtnText}>Add Plant</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfb",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A3C34",
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3d5a2d",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ffffff",
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: "#C6F062",
    borderRadius: 25,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A3C34",
  },
});


export default AddPlantScreen;


