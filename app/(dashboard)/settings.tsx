import React from "react";
import { View, Text, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DashboardHeader from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  return (
    <View style={styles.wrapper}>
      
      <LinearGradient
        // BOTTOM TO TOP: Pure white at the bottom to blend with Nav Bar
        // Muted Forest Mist at the top for that "little bit dark" feel
        colors={["#D6DED9", "#FFFFFF"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <DashboardHeader />

          <View style={styles.content}>
            {/* Header with high-contrast text */}
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
              <Text style={styles.subtitle}>Refine your plant care routine</Text>
            </View>

            {/* Elevated "Floating" Card */}
            <View style={styles.floatingCard}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications-outline" size={22} color="#3E4D48" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardText}>Care Notifications</Text>
                <Text style={styles.cardSubText}>Daily watering & feeding</Text>
              </View>
              <View style={styles.toggleStub} />
            </View>

            {/* Organic Element: Large Faded Leaf */}
            <View style={styles.leafOverlay}>
              <Ionicons name="leaf" size={320} color="#3E4D48" style={{ opacity: 0.04 }} />
            </View>

          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Matches the bottom of the gradient
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  header: {
    marginBottom: 35,
    zIndex: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#28332F", // Deep Earthy Charcoal
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    color: "#5C6B65", // Muted Moss
    marginTop: 4,
  },
  floatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#FFFFFF", // Pure white card
    padding: 20,
    borderRadius: 24,
    // Soft "Cloud" shadow for a premium feel
    shadowColor: "#28332F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 1,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F2F5F3",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#28332F",
  },
  cardSubText: {
    fontSize: 13,
    color: "#83918B",
    marginTop: 2,
  },
  toggleStub: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D6DED9", // Matches the top gradient color
  },
  leafOverlay: {
    position: 'absolute',
    bottom: -60,
    right: -80,
    transform: [{ rotate: '-15deg' }],
  },
});

export default Settings;