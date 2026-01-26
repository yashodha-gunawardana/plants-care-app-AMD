import { Ionicons } from "@expo/vector-icons";
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
            
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name={tab.icon as any}
                                size={24}
                                color={focused ? "#C6F062" : "rgba(255,255,255,0.4)"}
                            />
                        )
                    }}
                />
            ))}
        </Tabs>
    );
};