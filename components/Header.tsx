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
});


export default DashboardHeader;