import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const tabs = [
    { name: "home", icon: "home-outline", title: "Home" },
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
                        tabBarIcon: ({ focused }) => {
                            return (
                                <View style={styles.iconContainer}>
                                    
                                    {focused ? (
                                        <>
                                            <View style={styles.indicator}>
                                                <Ionicons
                                                    name={tab.icon as any}
                                                    size={26}
                                                    color="#1A3C34"
                                                />
                                            </View>

                                            <Text style={styles.tabLabel}>{tab.title}</Text>
                                        </>
                                        ) : (
                                        
                                        <Ionicons
                                            name={tab.icon as any}
                                            size={24}
                                            color="#1A3C34" 
                                            style={{ marginTop: 5 }}
                                        />
                                    )}
                                </View>
                            )
                        }
                    }}
                />
            ))}
        </Tabs>
    );
};


const styles = StyleSheet.create({
    tabBar: {
        height: 60,
        backgroundColor: "#FFFFFF", 
        position: "absolute",
        borderTopLeftRadius: 35,    
        borderTopRightRadius: 35,
        borderTopWidth: 0,          
        elevation: 10,
    },
    iconContainer: {
        alignItems: "center",       
        justifyContent: "center",
        width: 70
    },
    indicator: {
        position: "absolute",
        top: -45,                   
        width: 55,
        height: 55,
        backgroundColor: "#C6F062", 
        borderRadius: 30,
        borderWidth: 6,
        borderColor: "#FFFFFF",     
        alignItems: "center",
        justifyContent: "center"  
    },
    
    tabLabel: {
        color: "#1A3C34",           
        fontSize: 10,
        fontWeight: "700",
        position: "absolute",
        bottom: -30,                
    }
});

export default DashboardLayout;