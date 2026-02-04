import DashboardHeader from "@/components/Header";
import { PlantContext } from "@/context/PlantContext";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useContext, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Alert, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";


const WateringHistoryScreen = () => {
    const router = useRouter();

    const params = useLocalSearchParams();
    
    // get plants data and update function from plantContext
    const { plants, loading, updatePlantData } = useContext(PlantContext);

    // checking if a plantId exists
    const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;

    // find the relevant plants using id
    const plant = plants.find(p => p.id === plantId);


    // history handle
    const historyDataList = useMemo(() => {
        if (plant) {

            // history of the single plant
            return (plant.wateringHistory || []).map(date => ({
                date,
                plantName: plant.name,
                plantId: plant.id
            }));

        } else {

            // all plants history
            let allLogs: any[] = [];
            plants.forEach(p => {
                if (p.wateringHistory) {
                    p.wateringHistory.forEach(date => {
                        allLogs.push({
                            date,
                            plantName: p.name,
                            plantId: p.id
                        });
                    });
                }
            });
            return allLogs;
        }
    }, [plants, plant]);


    // sort the newest data comes first
    const sortedHistory = useMemo(() => {
        return [...historyDataList].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    
    }, [historyDataList]);

    

    if (loading) {
        return (
             <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#1A3C34" />
                <Text style={styles.loadingText}>Loading history...</Text>
                <Text style={styles.loadingSubText}>This will only take a moment</Text>
            </View>
        );
    };


    // delete individual watering history
    const handleDeleteLog = (logDate: string) => {
        if (!plant) return;

        Alert.alert(
            "Delete Record",
            "Are you sure, you want to delete this record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        
                        // remove the selected date and create new array
                        const updatedHistory = (plant.wateringHistory || []).filter(item => item !== logDate);
                        await updatePlantData(plant.id!, { 
                            wateringHistory: updatedHistory 
                        });
                    }
                }
            ]
        );
    };


    // delete all watering history
    const handleClearAll = () => {
        if (!plant) return;

        Alert.alert(
            "Clear History",
            "This will permanently delete all watering logs?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: async () => {

                        // empty the array and update firestore
                        await updatePlantData(plant.id!, {
                            wateringHistory: []
                        });
                    }
                }
            ]
        );
    };



    return (
        <LinearGradient
            colors={["#D6DED9", "#FFFFFF"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={{ flex: 1 }}>
               
            <DashboardHeader />

            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() =>
                            router.replace("/(dashboard)/home")}
                            style={styles.backBtn}>
                        
                        <Ionicons name="arrow-back" size={24} color="#1A3C34" />

                        <Text style={styles.title}>{plant ? plant.name : "Gardern Log"}</Text>
                    </TouchableOpacity>
                </View>

                {/* btn clear all */}
                {plant && (plant.wateringHistory?.length ?? 0) > 0 && (
                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={styles.clearBtn}>
                            
                    <Text style={styles.clearBtnText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.subtitle}>{plant 
                ? `Watering Logs (${plant.wateringHistory?.length || 0})` 
                : `Total Activities (${sortedHistory.length})`}
            </Text>

            {/* history data list */}
            <FlatList
                data={sortedHistory}
                keyExtractor={( item, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
                    
                // if no have data, show this 
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="water-outline" size={60} color="#E0E0E0" />
                        <Text style={styles.emptyText}>No watering records found</Text>
                    </View>
                }
                    
                renderItem={({ item }) => {
                    const date = new Date(item);

                    return (
                        <View style={styles.historyCard}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="water" size={20} color="#3498DB" />
                            </View>

                            {/* date and time */}
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>
                                    {date.toLocaleDateString('en-US', {
                                        weekday: "long", 
                                        month: "short",
                                        day: "numeric"
                                    })}
                                </Text>

                                <Text style={styles.timeText}>
                                    {date.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </Text>
                            </View>

                            {/* only one history delete btn */}
                            <TouchableOpacity
                                onPress={() => handleDeleteLog(item)}
                                style={styles.deleteIconBtn}>

                                <Ionicons name="trash-outline" size={20} color="#FFCDD2" />
                            </TouchableOpacity>
                        </View>
                    );
                }}>
            </FlatList>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 15,
    },

    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: { padding: 4 },
    title: { fontSize: 24, fontWeight: "800", color: "#1A3C34" },

    clearBtn: { 
        backgroundColor: '#FFF0F0', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 10 
    },

    clearBtnText: { color: '#D32F2F', fontWeight: '700', fontSize: 12 },

    subtitle: { 
        fontSize: 15, 
        color: "#7A8A7A", 
        marginHorizontal: 20, 
        marginBottom: 15, 
        marginTop: 8 
    },

    emptyContainer: { alignItems: 'center', marginTop: 80 },
    emptyText: { color: '#BDBDBD', fontSize: 16, marginTop: 10 },

    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 22,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    iconCircle: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#EBF5FB', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 15 
    },

    dateContainer: { flex: 1 },
    dateText: { fontSize: 16, fontWeight: '700', color: '#1A3C34' },
    timeText: { fontSize: 13, color: '#7A8A7A', marginTop: 2 },
    deleteIconBtn: { padding: 8, backgroundColor: '#FAFAFA', borderRadius: 10 },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: "rgba(253, 253, 251, 0.92)", 
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, 
    },
    loadingText: {
        marginTop: 20,
        color: "#1A3C34",
        fontWeight: "800",
        fontSize: 18,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    loadingSubText: {
        marginTop: 5,
        color: "#3d5a2d",
        fontSize: 12,
        fontWeight: "500",
        opacity: 0.7
    },

    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: {  fontSize: 20,  color: "#5DA87A" },

});


export default WateringHistoryScreen;