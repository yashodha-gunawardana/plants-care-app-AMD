import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";


interface PlantCardProps {
    item: Plant;
}

const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantCard = ({ item }: PlantCardProps) => {
    const router = useRouter();
    const { updatePlantData } = useContext(PlantContext);

    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "info" as "success" | "error" | "info",
    });


    // check water btn is disabale
    const isWateredToday = () => {
        if (!item.lastWatered) return false;

        const lastDate = new Date(item.lastWatered).toDateString();
        const today = new Date().toDateString();

        // if matching date give true
        return lastDate === today;
    };


    const watered = isWateredToday();

    // today water btn handle
    const handleWaterToday = async () => {
        if (watered) return;
        
        const now = new Date().toISOString();

        const updatedHistory = [now, ...(item.wateringHistory || [])];

        try {
            await updatePlantData(item.id!, {
                lastWatered: now,
                wateringHistory: updatedHistory,
            });

            setToast({
                visible: true,
                message: `${item.name} watered successfully 💧`,
                type: "success"
            });

            setTimeout(() => {
                setToast(p => ({ ...p, visible: false }));
            }, 2000);
            
        } catch (err) {
            console.log("Plant watering error: ", err);
            setToast({
                visible: true,
                message: "Could not update data.",
                type: "error"
            });
        }
    };


    const renderCareBadges = () => {
        const schedules = item.careSchedules;
        if (!schedules) return null;

        const activeSchedules = [
            { key: 'watering', val: schedules.watering, icon: 'water', color: '#4A90E2', bg: '#E1F5FE', unit: 'd' },
            { key: 'light', val: schedules.light, icon: 'sunny', color: '#FBC02D', bg: '#FFF9C4', unit: 'h' },
            { key: 'temp', val: schedules.temp, icon: 'thermometer', color: '#FF7043', bg: '#FBE9E7', unit: '°' },
            { key: 'fertilize', val: schedules.fertilize, icon: 'leaf', color: '#4CAF50', bg: '#E8F5E9', unit: 'w', isMaterial: true },
            { key: 'report', val: schedules.report, icon: 'shovel', color: '#795548', bg: '#EFEBE9', unit: 'm', isMaterial: true },
        ];


        // filter out only active care schedules
        const visible = activeSchedules.filter(
            c => c.val && typeof c.val.interval === "number" && c.val.interval > 0
        );


        // if no active schedules are found, show an empty-state message
        if (visible.length === 0) {
            return (
                <Text style={{ fontSize: 10, color: "#C0C8C0", fontWeight: "700" }}>
                    No schedules
                </Text>
            );
        }

        
        return (
            <View style={styles.badgeRow}>
                {visible.map((care) => {
                    if (!care.val || !care.val.interval) return null;

                    return (
                        <View key={care.key} style={[styles.careBadge, { backgroundColor: care.bg }]}>
                            {care.isMaterial ? (
                                <MaterialCommunityIcons name={care.icon as any} size={12} color={care.color} />
                            ) : (
                                <Ionicons name={care.icon as any} size={12} color={care.color} />
                            )}
                            <Text style={[styles.badgeText, { color: care.color }]}>
                                {care.val.interval}{care.unit}
                            </Text>
                        </View>
                    );
                })}
            </View>
        );
    };


    return (
        <View style={styles.cardWrapper}>
            {/* Image Section - 3 Corner Arch with Front Overlay Border */}
            <View style={styles.imageSectionWrapper}>
                <View style={styles.imageArchContainer}>
                    <Image source={{ uri: item.photo || DEFAULT_PLANT_IMAGE }} style={styles.cardImage} />
                </View>

                {/* front overlay border */}
                <View style={styles.floatingBorderOverlay} pointerEvents="none" />
            </View>

            {/* Details Section */}
            <View style={styles.detailsContainer}>

                {/* Upper Section */}
                <View>
                    <View style={styles.topRow}>
                        
                        {/* plant type*/}
                        <View style={styles.typeBadge}>
                            <Ionicons name="pricetag" size={8} color="#2D5A27" style={{ marginRight: 4 }} />
                            <Text style={styles.plantType} numberOfLines={1}>
                                {item.type || "Houseplant"}
                            </Text>
                        </View>

                        {/* water btn */}
                        <TouchableOpacity
                            onPress={handleWaterToday}
                            style={styles.quickWaterCircle}
                            activeOpacity={0.6}>

                            <Ionicons name="water" size={18} color="#4A90E2" />
                        </TouchableOpacity>
                    </View>

                    {/* plant name*/}
                    <Text style={styles.plantName} numberOfLines={2}>{`" ${item.name} "`}</Text>

                    {/* location row */}
                    <View style={styles.locationRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="leaf" size={10} color="#FFF" />
                        </View>
                        <Text style={styles.locationText}>{item.location || "Indoor Garden"}</Text>
                    </View>
                </View>

                <View style={styles.spacer} />

                {/* Footer Section */}
                <View style={styles.footer}>
                    <View style={styles.badgeColumn}>
                        <Text style={styles.scheduleLabel}>Schedules</Text>
                        {renderCareBadges()}
                    </View>

                    <TouchableOpacity 
                        activeOpacity={0.7}
                        style={styles.goAction}
                        onPress={() => 
                            router.push({ 
                                pathname: "/(modals)/plant-details", 
                                params: { id: item.id } 
                            })
                        }>
                    
                        {/* arrow in the card */}
                        <Ionicons name="arrow-down-right-box" size={18} color="#2E6B46" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({

    cardWrapper: {
        flexDirection: "row",
        backgroundColor: "#FBFBF9", 
        borderRadius: 28,
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: "#E0E5E0", 
        borderRightWidth: 1,
        borderRightColor: "#E8EBE8",
        elevation: 5,
    },
    imageSectionWrapper: {
        width: 125,
        height: 165,
        position: 'relative',
    },
    imageArchContainer: {
        width: 130,
        height: 160,
        backgroundColor: "#F5F5F3",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 0,
        overflow: "hidden",
        zIndex: 1,
        marginTop: 5,
        marginLeft: 10,
    },
    floatingBorderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 130, 
        height: 160,
        borderWidth: 1.2,
        borderColor: "#2E6B46", 
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 0,
        zIndex: 2,
    },
    cardImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    
    detailsContainer: {
        flex: 1,
        marginLeft: 30,
        justifyContent: "space-between",
        height: 165,
        paddingVertical: 5,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#E8F0E8", 
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    plantType: {
        fontSize: 9,
        fontWeight: "800",
        color: "#2E6B46",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    quickWaterCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E1F5FE', 
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -5, 
    },
    plantName: {
        fontSize: 22,
        fontWeight: "900",
        color: "#1A3C34",
        lineHeight: 26,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    iconCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#2E6B46", 
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    locationText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#5C735C", 
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    spacer: {
        height: 1,
        backgroundColor: "#E8EBE8",
        width: '40%',
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    badgeColumn: {
        flex: 1,
    },
    scheduleLabel: {
        fontSize: 9,
        fontWeight: "800",
        color: "#BCC6BC",
        textTransform: "uppercase",
        marginBottom: 8,
    },
    goAction: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },

    badgeRow: { flexDirection: "row", flexWrap: 'wrap', gap: 6 },

    careBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 4,
    },

    badgeText: { fontSize: 9, fontWeight: "800" }

});


export default PlantCard;