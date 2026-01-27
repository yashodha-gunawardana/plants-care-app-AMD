import { usePathname } from "expo-router"
import { View, StyleSheet, TouchableOpacity, Text, Platform, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const DashboardHeader = () => {
    // current route path
    const pathname = usePathname();
    const [helpVisible, setHelpVisible] = useState(false);

    const isHome = pathname.includes("home");
    const isWiki = pathname.includes("wiki");
    const isAdd = pathname.includes("add");

    const getHeaderTitle = () => {
        if (pathname.includes("home"))
            return "My Garden";

        if (pathname.includes("wiki"))
            return "Plants Wiki";

        if (pathname.includes("add"))
            return "Add Plants";

        if (pathname.includes("log"))
            return "Water Log";

        if (pathname.includes("settings"))
            return "Settings";

        return "Dashboard";
    };


    const helpItems = [
        { title: "Plant Name", detail: "Enter the common name (e.g., Peace Lily). Optional: Scientific name for accuracy." },
        { title: "Photos", detail: "Upload a clear image. Multiple photos help track growth over time." },
        { title: "Location / Slot", detail: "Where the plant lives (e.g., Living Room, Balcony, Desk)." },
        { title: "Watering Frequency", detail: "How often you water (e.g., every 7 days). App calculates next watering." },
        { title: "Last Watered Date", detail: "Optional; helps app generate reminders." },
        { title: "Light Requirement", detail: "Select Low / Medium / Bright Indirect / Direct. Proper lighting is essential." },
        { title: "Soil Type / Notes", detail: "Optional, e.g., 'well-draining cactus mix'." },
        { title: "Care Difficulty", detail: "Easy / Moderate / Hard." },
        { title: "Fertilizer Schedule", detail: "Optional, e.g., 'Every 4 weeks during growing season'." },
        { title: "Tags / Categories", detail: "Optional, e.g., indoor, succulent, flowering." },
    ];


    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#E8F2E6", "#F9FCF8", "#FFFFFF"]} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBg}>

                <View style={styles.sunGlow} />

                <View style={styles.contentRow}>
                    {/* title */}
                    <View style={styles.titleContainer}>
                        <View style={styles.verticalAccent} />
                        <View>
                            <Text style={styles.brandTag}>GARDINO CARE</Text>
                            <Text style={styles.screenTitle}>{getHeaderTitle()}</Text>
                        </View>
                    </View>

                    {/* button and icons */}
                    <View style={styles.actionCluster}>
                        {(isHome || isWiki) && (
                            <TouchableOpacity style={styles.iconCircle}>
                                <Ionicons name="search-outline" size={22} color="#1A3C34" />
                            </TouchableOpacity>
                        )}

                        {/* help icon */}
                        {isAdd && (
                            <TouchableOpacity 
                                style={styles.helpPill} 
                                onPress={() => setHelpVisible(true)}
                            >
                                <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                                <Text style={styles.helpText}>GUIDE</Text>
                            </TouchableOpacity>
                        )}

                        {/* notification icon */}
                        <TouchableOpacity style={styles.iconCircle}>
                            <Ionicons name="notifications-outline" size={22} color="#1A3C34" />
                            <View style={styles.redIndicator} />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            {/* help modal */}
            <Modal animationType="fade" transparent={true} visible={helpVisible}>
                <View style={styles.modalOverlay}>
                    <BlurView 
                        intensity={40}       
                        tint="dark"          
                        style={StyleSheet.absoluteFill} 
                    />

                    <View style={styles.modalSheet}>
                        <View style={styles.dragBar} />

                        <Text style={styles.modalHeading}>Add Plant Guide</Text>
                        <Text style={styles.modalSub}>Follow these steps to add your plant correctly:</Text>

                        <ScrollView 
                            showsVerticalScrollIndicator={false} // Hides default scrollbar
                            style={styles.scrollArea}>

                            {helpItems.map((item, index) => (
                                <View key={index} style={styles.infoRow}>
                        
                                    <View style={styles.iconBox}>
                                        <Ionicons 
                                            name="checkmark-circle" 
                                            size={20} 
                                            color="#C6F062" 
                                        />
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    gradientBg: {
        width: "100%",
        paddingTop: Platform.OS === 'android' ? 30 : 0,
        overflow: "hidden",
    },
    sunGlow: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: "#C6F062",
        opacity: 0.15,
        top: -100,
        right: -50,
    },
    contentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 18,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    verticalAccent: {
        width: 4,
        height: 32,
        backgroundColor: "#C6F062",
        borderRadius: 2,
        marginRight: 12,
    },
    brandTag: {
        fontSize: 10,
        fontWeight: "800",
        color: "#8A9687",
        letterSpacing: 1.8,
    },
    screenTitle: {
        fontSize: 26,
        fontWeight: "900",
        color: "#1A3C34",
        marginTop: -2,
    },
    actionCluster: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.8)",
    },
    helpPill: {
        flexDirection: "row",
        backgroundColor: "#1A3C34",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: "center",
        gap: 6,
    },
    helpText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "900",
    },
    redIndicator: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#FF6B6B",
        borderWidth: 1.5,
        borderColor: "#FFF",
    },
    modalOverlay: { 
        flex: 1, 
        justifyContent: "flex-end",
    },
    modalSheet: { 
        backgroundColor: "#1A3C34", 
        borderTopLeftRadius: 35, 
        borderTopRightRadius: 35, 
        padding: 25, 
        height: "65%",
    },
    dragBar: { 
        width: 40, 
        height: 4, 
        backgroundColor: "rgba(255,255,255,0.1)", 
        alignSelf: "center", 
        marginBottom: 20 
    },
    modalHeading: { color: "#C6F062", fontSize: 24, fontWeight: "900", marginBottom: 5 },
    modalSub: { color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 25 },
    scrollArea: { marginBottom: 20 },
    infoRow: { flexDirection: "row", gap: 16, marginBottom: 25 },
iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },

});


export default DashboardHeader;