import { Tabs } from "expo-router";


const tabs = [
    { name: "garden", icon: "home-outline", title: "Home" },
    { name: "wiki", icon: "book-outline", title: "Wiki" },
    { name: "add", icon: "add-circle-outline", title: "Add" },
    { name: "log", icon: "water-outline", title: "Water" },
    { name: "settings", icon: "settings-outline", title: "Settings" }
];

const DashboardLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 75,
                    backgroundColor: "#1A3C34",
                    borderTopLeftRadius: 40,
                    borderTopRightRadius: 40,
                    position: "absolute"
                },
            }}>

        </Tabs>
    )
}