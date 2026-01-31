import { Plant } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";


interface PlantCardProps {
    item: Plant
};


const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantCard = ({ item }: PlantCardProps) => {
    const router = useRouter();

    // render small status icons 
    const renderCareBadges = () => {
        const schedules = item.careSchedules;

        if (!schedules) return null;

        const activeSchedules = [
            { key: 'watering', val: schedules.watering, icon: 'water', color: '#4A90E2', bg: '#E1F5FE', unit: 'd' },
            { key: 'fertilize', val: schedules.fertilize, icon: 'leaf', color: '#4CAF50', bg: '#E8F5E9', unit: 'w', isMaterial: true },
            { key: 'repot', val: schedules.report, icon: 'shovel', color: '#795548', bg: '#EFEBE9', unit: 'm', isMaterial: true },
        ];


        return (
            <View style={styles.badgeRow}>
                {activeSchedules.map((care) => {

                    // only show a badge if an interval (frequency) is actually set
                    if (!care.val || !care.val.interval) return null;

                    return (
                        <View 
                            key={care.key} 
                            style={[styles.careBadge, { backgroundColor: care.bg }]}>

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
        <TouchableOpacity
            activeOpacity={0.95}
            style={styles.cardWrapper}>

            {/* image & location */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.photo || DEFAULT_PLANT_IMAGE }} style={styles.cardImage} />

                <View style={styles.locationPill}>
                    <Text style={styles.locationText}>{item.location || "Indoor"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({

    cardWrapper: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 24,
        marginBottom: 20,
        padding: 12,
        elevation: 4
    },
    imageContainer: {
        width: 110,
        height: 140,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative"
    },
    locationPill: {
        position: "absolute",
        bottom: 8,
        left: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.85)",
        paddingVertical: 4,
        borderRadius: 8,
        alignItems: "center"
    },
    locationText: {
        fontSize: 9,
        fontWeight: "800",
        color: "#1A3C34",
        textTransform: "uppercase"
    },
        
    badgeRow: { flexDirection: "row", gap: 6 },

    careBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },

    badgeText: { fontSize: 10, fontWeight: "800" }

});