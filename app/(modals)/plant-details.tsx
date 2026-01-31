import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext } from "react";
import { Dimensions, StyleSheet, View, Text, Alert, TouchableOpacity, Platform, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const { width, height } = Dimensions.get("window");

const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/736x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantDetailsModal = () => {

    // retrieve the plant ID from the URL parameters
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { plants, removePlant } = useContext(PlantContext);

    // find the specific plant object that matches the ID from the URL
    const plant = plants.find((p) => p.id === id);

    // if no plant is found, show message
    if (!plant) {
        return (
            <View style={styles.center}>
                <Text>Plant not found</Text>
            </View>
        );
    }


    // handle plants delete
    const handleDelete = () => {
        Alert.alert(
            "Delete Plant",
            `Are you sure you want to remove  ${plant.name}?`,[
                { text: "Cancel", style: "cancel"},
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // remove from global state
                        await removePlant(plant.id!);
                        router.back();
                    }
                }
        ]);
    };


    // reusable component for care items
    const CareRow = ({ icon, label, value, isMaterial = false }: any) => (
        <View style={styles.careRow}>
            <View style={styles.careIconBox}>
                {isMaterial ? (
                    <MaterialCommunityIcons name={icon} size={24} color="#1A3C34" />
                ) : (
                    <Ionicons name={icon} size={24} color="#1A3C34" />
                )}
            </View>

            <View style={styles.careTextContainer}>
                <Text style={styles.careLabel}>{label}</Text>
                <Text style={styles.careValue}>{value}</Text>
            </View>
        </View>
    );


    // format the interval numbers into human-readable text
    const getCareValue = (type: keyof Required<Plant>['careSchedules'], unit: string) => {
        const schedule = plant.careSchedules?.[type];
        if (!schedule || !schedule.interval || schedule.interval === 0) return "Not scheduled";
        
        const interval = schedule.interval;
        if (interval === 1 && unit === "day") return `Daily`;
        if (interval === 7 && unit === "day") return `Once a week`;
        return `Every ${interval} ${unit}${interval > 1 ? "s" : ""}`; // handles pluralization
    };


    const imageSource = plant.photo ? { uri: plant.photo } : { uri: DEFAULT_PLANT_IMAGE };


    return (
        <View style={styles.mainContainer}>
            <View style={styles.topGreenBg} />

            <SafeAreaView style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backBtn}>

                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => 
                        router.push({ 
                            pathname: "/(modals)/edit-plant", 
                            params: { id: plant.id } 
                        })
                    }>
                    <Ionicons name="pencil" size={18} color="#1A3C34" />
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}>

                {/* name and type */}
                <View style={styles.infoTopSection}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <Text style={styles.plantType}>{plant.type || "Houseplant"}</Text>
                </View>

                {/* white rounded content details */}
                <View style={styles.contentCard} />

                <View style={styles.imagePortalContainer}>
                    <Image
                        source={imageSource}
                        style={styles.portalImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.locationTag}>
                    <Ionicons name="location" size={18} color="#1A3C34" />
                    <Text style={styles.locationText}>{plant.location || "Living Room"}</Text>
                </View>

                <Text style={styles.sectionTitle}>Plant care</Text>

                {/* care row */}
                <CareRow icon="water-outline" label="Watering" value={getCareValue("watering", "day")} />
                <CareRow icon="sunny-outline" label="Light" value={getCareValue("light", "hour")} />
                <CareRow 
                    icon="thermometer-outline" 
                    label="Temperature" 
                    value={plant.careSchedules?.temp?.interval ? `${plant.careSchedules.temp.interval}°C` : "Not set"} 
                />
                <CareRow icon="seed-outline" label="Fertilize" value={getCareValue("fertilize", "month")} isMaterial />
                <CareRow icon="shovel" label="Repot" value={getCareValue("report", "year")} isMaterial />

                {/* delete btn */}
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={16} color="#FF5252" />
                    <Text style={styles.deleteBtnText}>Remove Plant</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({

    mainContainer: { flex: 1, backgroundColor: "#FFF" },

    topGreenBg: {
        position: "absolute",
        top: 0,
        width: width,
        height: height * 0.35,
        backgroundColor: "#1A3C34",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 40 : 10,
        zIndex: 10,
    },

    backBtn: { padding: 5 },

    editBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 50,
        width: 42,
        height: 42,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    scrollContent: { flexGrow: 1 },

    infoTopSection: {
        paddingHorizontal: 25,
        paddingTop: 30,
        height: height * 0.22,
        justifyContent: 'center',
    },
    plantName: { 
        fontSize: 40, 
        fontWeight: "900", 
        color: "#FFF", 
        letterSpacing: -1.5 
    },
    plantType: { 
        fontSize: 18, 
        color: "rgba(255,255,255,0.7)", 
        marginTop: 2, 
        fontWeight: "500" 
    },
    contentCard: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 30,
        paddingTop: 50,
        minHeight: height * 0.7,
        zIndex: 3,
    },
    imagePortalContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#FFF",
        position: "absolute",
        top: -65, 
        right: 30,
        padding: 6,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 4,
    },

    portalImage: { width: "100%", height: "100%", borderRadius: 60 },

    locationTag: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 25, 
        gap: 6 
    },
    locationText: { color: "#1A3C34", fontSize: 16, fontWeight: "700" },
  
    sectionTitle: { 
        fontSize: 22, 
        fontWeight: "800", 
        color: "#000", 
        marginBottom: 25 
    },

    deleteBtn: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 10,
    },

    deleteBtnText: { color: "#FF5252", fontWeight: "700", fontSize: 14 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    careRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

    careIconBox: {
        width: 58,
        height: 58,
        backgroundColor: "#F4F6F4",
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 18,
    },

    careTextContainer: { flex: 1 },
    careLabel: { fontSize: 18, fontWeight: "800", color: "#1A3C34" },
    careValue: { fontSize: 14, color: "#7A8A7A", marginTop: 2, fontWeight: "500" },
})