import React from "react";
import { StyleSheet, View, Text } from "react-native";
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
                            <View style={styles.iconContainer}>
                                {focused && <View style={styles.indicator} />}
                            
                                    <Ionicons
                                        name={tab.icon}
                                        size={24}
                                        color={focused ? "#C6F062" : "rgba(255,255,255,0.4)"}
                                        style={focused ? styles.activeIcon : null}
                                    />
                                {focused && <Text style={styles.tabLabel}>{tab.title}</Text>}
                            </View>
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
    },
    iconContainer: {
        alignItems: "center",       
        justifyContent: "center",
    },
    indicator: {
        position: "absolute",
        top: -45,                   
        width: 55,
        height: 55,
        backgroundColor: "#C6F062", 
        borderRadius: 30,
        borderWidth: 6,
        borderColor: "#fdfdfb",     
    },
    activeIcon: {
        transform: [{ translateY: -30 }], 
    },
    tabLabel: {
        color: "white",
        fontSize: 10,
        fontWeight: "700",
        position: "absolute",
        bottom: -15,                
    }
});


export default DashboardLayout;