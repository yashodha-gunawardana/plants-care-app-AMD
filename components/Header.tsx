import { usePathname } from "expo-router"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";


const DashboardHeader = () => {
    // current route path
    const pathname = usePathname();
    const [helpVisible, setHelpVisible] = useState(false);

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
            <TouchableOpacity>
                <Ionicons
                    name="menu-outline"
                    size={26}
                    color="#2D4F1E"
                />
            </TouchableOpacity>

            <Text style={styles.title}>
                {getHeaderTitle()}
            </Text>

            <TouchableOpacity>
                <Ionicons
                    name="person-circle-outline"
                    size={30}
                    color="#2D4F1E"
                />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",              
        alignItems: "center",             
        justifyContent: "space-between",   
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2D4F1E",
    },
});


export default DashboardHeader;