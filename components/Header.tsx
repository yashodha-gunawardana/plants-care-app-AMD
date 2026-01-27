import { usePathname } from "expo-router"
import { View, StyleSheet } from "react-native";



const DashboardHeader = () => {
    // current route path
    const pathname = usePathname();

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

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",              
        alignItems: "center",             
        justifyContent: "space-between",   
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
})