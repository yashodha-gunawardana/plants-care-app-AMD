import { usePathname } from "expo-router"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";


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

                    <View style={styles.actionCluster}>

                    </View>
                </View>
            </LinearGradient>

            
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
});


export default DashboardHeader;