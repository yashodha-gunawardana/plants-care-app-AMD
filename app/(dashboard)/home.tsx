// home.tsx
import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false} // Hide scrollbar like in HTML
    >
      {/* Greeting / Notification Card */}
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>
          You have 1 plant that needs water today!
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-outline" size={16} color="#3d5a2d" />
        </TouchableOpacity>
      </View>

      {/* Add New Plant Card */}
      <TouchableOpacity style={styles.addPlantCard}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 18 }}>🌿</Text>
          <Text style={styles.addPlantText}>Add New Plant</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} color="gray" />
      </TouchableOpacity>

      {/* Plant Grid */}
      <View style={styles.plantGrid}>
        {/* Plant Card 1 */}
        <View style={styles.plantCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&q=80&w=200" }}
            style={styles.plantImage}
          />
          <View style={styles.waterBadge}>
            <Ionicons name="water" size={16} color="#4A90E2" />
          </View>
          <View style={styles.plantOverlay}>
            <Text style={styles.plantName}>Sunny</Text>
            <Text style={styles.plantSpecies}>Snake Plant</Text>
            <TouchableOpacity style={styles.waterButton}>
              <Text style={styles.waterButtonText}>Water Today</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plant Card 2 */}
        <View style={styles.plantCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=200" }}
            style={styles.plantImage}
          />
          <View style={styles.plantOverlay}>
            <Text style={styles.plantName}>Leafy</Text>
            <Text style={styles.plantSpecies}>Fiddle Leaf Fig</Text>
            <TouchableOpacity style={styles.waitButton}>
              <Text style={styles.waitButtonText}>2 days left</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plant Card 3 */}
        <View style={styles.plantCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=200" }}
            style={styles.plantImage}
          />
          <View style={styles.plantOverlay}>
            <Text style={styles.plantName}>Spiky</Text>
            <Text style={styles.plantSpecies}>Aloe Vera</Text>
            <TouchableOpacity style={styles.waitButton}>
              <Text style={styles.waitButtonText}>5 days left</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plant Card 4 */}
        <View style={styles.plantCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1596434446631-0797374b9669?auto=format&fit=crop&q=80&w=200" }}
            style={styles.plantImage}
          />
          <View style={styles.plantOverlay}>
            <Text style={styles.plantName}>Ferny</Text>
            <Text style={styles.plantSpecies}>Boston Fern</Text>
            <TouchableOpacity style={styles.waitButton}>
              <Text style={styles.waitButtonText}>Tomorrow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

// ---------------------- Styles ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfb", // Keep original background
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: "#dcedca",
    borderRadius: 24,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  notificationText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3d5a2d",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  addPlantCard: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 28,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  addPlantText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3d5a2d",
  },
  plantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  plantCard: {
    width: (width - 48) / 2, // Two columns with spacing
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  plantImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  waterBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  plantOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "linear-gradient(transparent, rgba(0,0,0,0.7))",
    padding: 12,
    justifyContent: "flex-end",
  },
  plantName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  plantSpecies: {
    color: "#fff",
    fontSize: 10,
    marginBottom: 4,
  },
  waterButton: {
    backgroundColor: "#4A6741",
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  waterButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  waitButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  waitButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
