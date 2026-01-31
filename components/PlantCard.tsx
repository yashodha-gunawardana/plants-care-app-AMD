import { Plant } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, StyleSheet, Text } from "react-native";


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



}


const styles = StyleSheet.create({

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