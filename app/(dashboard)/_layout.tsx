import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";


const { width } = Dimensions.get("window");

const tabs = [
    { name: "home", icon: "home-outline", title: "Home" },
    { name: "wiki", icon: "book-outline", title: "Explore" },
    { name: "add", icon: "add-circle-outline", title: "Create" },
    { name: "log", icon: "leaf-outline", title: "Status" },
    { name: "settings", icon: "settings-outline", title: "Settings" }
];

const CustomTabBar = ({ state, navigation }: any) => {
    const activeIndex = state.index;
    const tabWidth = 400 / tabs.length;
    const notchX = (activeIndex * tabWidth) + (tabWidth / 2);

    return (
        <View style={styles.navContainer}>

            {/* The Liquid Notch SVG Background with Grey Border */}
            <View style={StyleSheet.absoluteFill}>
                <Svg viewBox="0 0 400 80" width={width} height={105}>
                    <Path
                        fill="#FFFFFF"
                        stroke="#C6F062"
                        strokeWidth="0.8"
                        d={`
                        M 0 20 
                        L ${notchX - 45} 20 
                        C ${notchX - 25} 20, ${notchX - 20} 55, ${notchX} 55
                        C ${notchX + 20} 55, ${notchX + 25} 20, ${notchX + 45} 20
                        L 400 20
                        L 400 80
                        L 0 80
                        L 0 20
                        Z
                        `}
                    />
                </Svg>
            </View>

            {/* The Icons and Labels */}
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const isFocused = state.index === index;
                    const tab = tabs.find(t => t.name === route.name) || tabs[0];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <Pressable key={route.key} onPress={onPress} style={styles.tabButton}>
                            {isFocused ? (
                                <View style={styles.activeContainer}>
                                    <View style={styles.indicator}>
                                        <Ionicons name={tab.icon.replace("-outline", "") as any} size={25} color="#fff" />
                                    </View>
                                    <Text style={styles.tabLabel}>{tab.title}</Text>
                                </View>
                            ) : (
                                <Ionicons name={tab.icon as any} size={20} color="#9CA3AF" />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};



const DashboardLayout = () => {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}>
            
            {tabs.map((tab) => (
                <Tabs.Screen key={tab.name} name={tab.name} />
            ))}
        </Tabs>
    );
};



const styles = StyleSheet.create({

    navContainer: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: 90,
        backgroundColor: 'transparent',
    },
    tabBar: {
        flexDirection: 'row',
        height: 100,
        marginTop: 10,
        alignItems: 'center',
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeContainer: {
        alignItems: 'center',
        width: '100%',
    },
    indicator: {
        position: 'absolute',
        top: -35, 
        width: 56,
        height: 56,
        backgroundColor: '#1A3C34',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#C6F062',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1A3C34',
        textTransform: 'uppercase',
        marginTop: 38,
        letterSpacing: 0.5,
    }

});



export default DashboardLayout;