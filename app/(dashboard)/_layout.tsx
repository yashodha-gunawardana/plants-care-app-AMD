import React from "react";
import { StyleSheet } from "react-native";
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
                tabBarStyle: styles.tabBar
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


const styles = StyleSheet.create({
    tabBar: {
        height: 75,
        backgroundColor: "#1A3C34", 
        position: "absolute",
        borderTopLeftRadius: 35,    
        borderTopRightRadius: 35,
        borderTopWidth: 0,          
        elevation: 10,
    }
})


export default DashboardLayout;