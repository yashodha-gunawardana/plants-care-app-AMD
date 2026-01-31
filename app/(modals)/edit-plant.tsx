import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View, Text, Switch, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CareSetupModal from "@/components/CareModal";

 
const { width } = Dimensions.get("window");

const DEFAULT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";

type CareType = "watering" | "light" | "temp" | "fertilize" | "report";



const EditPlantModal = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // access global state and functions from the PlantContext
    const { plants, updatePlantData, removePlant } = useContext(PlantContext);

    const plant = plants.find((p) => p.id === id);
    if (!plant) return null;


    const [plantPhoto, setPlantPhoto] = useState<string | null>(plant.photo || null);
    const [plantName, setPlantName] = useState(plant.name || "");
    const [plantType, setPlantType] = useState(plant.type || "");
    const [location, setLocation] = useState(plant.location || "");

    const [isModalVisible, setIsModalVisible] = useState(false);   // controls the care config modal
    const [activeCare, setActiveCare] = useState<CareType | null>(null);  // tracks which care item is being edited
    const [loading, setLoading] = useState(false); 

    const [reminders, setReminders] = useState({
        watering: !!plant.careSchedules?.watering,
        light: !!plant.careSchedules?.light,
        temp: !!plant.careSchedules?.temp,
        fertilize: !!plant.careSchedules?.fertilize,
        report: !!plant.careSchedules?.report,
    });

    const [careSchedules, setCareSchedules] = useState(plant.careSchedules || {
        watering: { interval: 0, selectedDays: [], selectedTime: "09:00" },
        light: { interval: 0, selectedDays: [], selectedTime: "09:00" },
        temp: { interval: 0, selectedDays: [], selectedTime: "09:00" },
        fertilize: { interval: 0, selectedDays: [], selectedTime: "09:00" },
        report: { interval: 0, selectedDays: [], selectedTime: "09:00" },
    });

    const [modalConfig, setModalConfig] = useState({
        interval: 0,
        selectedOption: "",
        selectedDays: [] as number[],
        selectedTime: "09:00",
    });

    const careConfigs: Record<CareType, any> = {
        watering: { title: "Watering", icon: "water", color: "#4CAF50", unit: "days", options: [{ label: "Daily", value: "1" }, { label: "Weekly", value: "7" }] },
        light: { title: "Light", icon: "sunny", color: "#4CAF50", unit: "hours", options: [{ label: "Low", value: "4" }, { label: "High", value: "12" }] },
        temp: { title: "Temperature", icon: "thermometer", color: "#4CAF50", unit: "°C", options: [{ label: "Cool", value: "18" }, { label: "Warm", value: "25" }] },
        fertilize: { title: "Fertilize", icon: "leaf", color: "#4CAF50", unit: "weeks", options: [{ label: "Bi-weekly", value: "2" }, { label: "Monthly", value: "4" }] },
        report: { title: "Repot", icon: "archive", color: "#4CAF50", unit: "months", options: [{ label: "Yearly", value: "12" }] },
    };

    const toggleCare = (key: CareType) => {
        if (!reminders[key]) {
            setActiveCare(key);
            const current = (careSchedules as any)[key] || { 
                interval: 1, 
                selectedDays: [], 
                selectedTime: "09:00" 
            };
            setModalConfig({
                interval: current.interval || 1,
                selectedDays: current.selectedDays || [],
                selectedTime: current.selectedTime || "09:00",
                selectedOption: "",
            });
            setIsModalVisible(true);
        
        } else {
            setReminders(prev => ({ ...prev, [key]: false }));
        }
    };


    // saves the modal changes into the local careSchedules state
    const handleApplySchedule = () => {
        if (activeCare) {
            setCareSchedules(prev => ({ ...prev, [activeCare]: { ...modalConfig } }));
            setReminders(prev => ({ ...prev, [activeCare]: true }));
        }
        setIsModalVisible(false);
    };


    // handle plant update
    const handleUpdate = async () => {
        if (!plantName.trim()) return
        Alert.alert(
            "Required",
            "Plant name is needed"
        );
        setLoading(true);

        const updatedPlant: Partial<Plant> = {
            name: plantName.trim(),
            type: plantType.trim(),
            location: location.trim(),
            photo: plantPhoto || undefined,
            careSchedules: {
                watering: reminders.watering ? careSchedules.watering : undefined,
                light: reminders.light ? careSchedules.light : undefined,
                temp: reminders.temp ? careSchedules.temp : undefined,
                fertilize: reminders.fertilize ? careSchedules.fertilize : undefined,
                report: reminders.report ? careSchedules.report : undefined,
            }
        };
        await updatePlantData(id, updatedPlant);
        setLoading(false);
        router.back();
    };


    const CareRow = ({ type }: { type: CareType }) => {
        const config = careConfigs[type];
        const isEnabled = reminders[type];
        const schedule = (careSchedules as any)[type];


        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    setActiveCare(type);
                    setModalConfig({
                        interval: schedule?.interval || 1,
                        selectedDays: schedule?.selectedDays || [],
                        selectedTime: schedule?.selectedTime || "09:00",
                        selectedOption: ""
                    });
                    setIsModalVisible(true);
                }}
                style={[styles.careRow, isEnabled && styles.careRowEnabled]}>


                {/* care icon box */}
                <View style={[styles.careIconContainer, { backgroundColor: isEnabled ? `${config.color}15` : "#F5F5F5" }]}>
                    <Ionicons 
                        name={config.icon} s
                        ize={22} 
                        color={isEnabled ? config.color : "#BCBCBC"} 
                    />
                </View>

                {/* care text indo */}
                <View style={styles.careTextContainer}>
                    <Text style={styles.careTitle}>{config.title}</Text>
                    <Text style={styles.careSubtitle}>
                        {isEnabled ? `Every ${schedule?.interval} ${config.unit}` : "Reminder Off"}
                    </Text>
                </View>   

                {/* toggle switch */}
                <Switch
                    value={isEnabled}
                    onValueChange={() => toggleCare(type)}
                    trackColor={{ false: "#E0E0E0", true: "#C6F062" }}
                    thumbColor={isEnabled ? "#1A3C34" : "#FFF"}
                />             
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>

            {/* ensures the keyboard doesn't cover input fields on iOS */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}>

                    {/* header */}
                    <View style={styles.headerBackground}>
                        <SafeAreaView style={styles.topBar}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
                                <Ionicons name="close" size={24} color="#1A3C34" />
                            </TouchableOpacity>

                            <Text style={styles.headerLabel}>Edit Plant</Text>
                            
                            <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn} disabled={loading}>
                                {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.saveBtnText}>Save</Text>}
                            </TouchableOpacity>
                        </SafeAreaView>

                        {/* plant image and camera */}
                        <View style={styles.imageWrapper}>
                            <View style={styles.imageShadow}>
                                <Image source={{ uri: plantPhoto || DEFAULT_IMAGE }} style={styles.plantImg} />
                                <TouchableOpacity style={styles.camBadge} onPress={async () => {
                                    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
                                    if (!result.canceled) setPlantPhoto(result.assets[0].uri);
                                }}>
                                    <Ionicons name="camera" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* input fields */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Display Name</Text>
                            <TextInput 
                                style={styles.mainInput} 
                                value={plantName} 
                                onChangeText={setPlantName} 
                                placeholder="e.g. Monstera Deliciosa" 
                                placeholderTextColor="#C0C0C0"
                            />
                        </View>

                        <View style={styles.pillRow}>
                            <View style={styles.pillInputBox}>
                                <Ionicons name="leaf-outline" size={16} color="#1A3C3480" />
                                <TextInput 
                                    style={styles.smallInput} 
                                    value={plantType} 
                                    onChangeText={setPlantType} 
                                    placeholder="Species" 
                                />
                            </View>

                            <View style={styles.pillInputBox}>
                                <Ionicons name="location-outline" size={16} color="#1A3C3480" />
                                <TextInput 
                                    style={styles.smallInput} 
                                    value={location} 
                                    onChangeText={setLocation} 
                                    placeholder="Location" 
                                />
                            </View>
                        </View>

                        {/* care schedule */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Care Schedule</Text>
                            <Text style={styles.sectionSubtitle}>Tap to configure details</Text>
                        </View>

                        {/* generate the list of Care Rows */}
                        {(Object.keys(careConfigs) as CareType[]).map(type => (
                            <CareRow key={type} type={type} />
                        ))}

                        {/* delete btn */}
                        <TouchableOpacity 
                            style={styles.deleteBtn} 
                            onPress={() => {
                                Alert.alert("Remove Plant", "This will permanently delete this plant's history.", [
                                { text: "Cancel", style: "cancel" },
                                { text: "Delete", style: "destructive", 
                                    onPress: () => { removePlant(id); router.back(); } }
                                ]);
                            }}>
                            
                            <Ionicons name="trash-outline" size={18} color="#FF5252" />
                            <Text style={styles.deleteText}>Delete Plant Profile</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* configuration modal */}
            {isModalVisible && activeCare && careConfigs[activeCare] && (
                <CareSetupModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    activeCare={activeCare}
                    config={careConfigs[activeCare]}
                    tempConfig={modalConfig}
                    setTempConfig={setModalConfig}
                    onApply={handleApplySchedule}
                    onTrackPress={(e: any) => {
                        const { locationX } = e.nativeEvent;
                        const trackWidth = width - 100; 
                        const newValue = Math.round((locationX / trackWidth) * 30) || 1;
                        setModalConfig(p => ({ ...p, interval: newValue }));
                    }}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#FBFCFB" },
    scrollContent: { paddingBottom: 60 },

    headerBackground: { 
        backgroundColor: "#F2F5F2", 
        paddingBottom: 40, 
        borderBottomLeftRadius: 40, 
        borderBottomRightRadius: 40 
    },
    topBar: { 
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 15 : 0
    },
    roundBtn: { 
        backgroundColor: "#FFF", 
        padding: 8, 
        borderRadius: 20 
    },
    headerLabel: { 
        fontWeight: "800", 
        color: "#1A3C34", 
        textTransform: "uppercase", 
        fontSize: 12, 
        letterSpacing: 1.2 
    },
    saveBtn: { 
        backgroundColor: "#1A3C34", 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 12 
    },
    saveBtnText: { 
        color: "#FFF", 
        fontWeight: "700", 
        fontSize: 14 
    },

    imageWrapper: { alignItems: "center", marginTop: 20 },

    imageShadow: {
        width: 160, 
        height: 160, 
        borderRadius: 80,
        backgroundColor: "#FFF", 
        elevation: 15
    },
    plantImg: { 
        width: "100%", 
        height: "100%", 
        borderRadius: 80, 
        borderWidth: 4, 
        borderColor: "#FFF" 
    },
    camBadge: { 
        position: "absolute", 
        bottom: 0, 
        right: 0, 
        backgroundColor: "#1A3C34", 
        padding: 10, 
        borderRadius: 20, 
        borderWidth: 4, 
        borderColor: "#F2F5F2" 
    },

    formContainer: { paddingHorizontal: 24, marginTop: 25 },
    inputGroup: { marginBottom: 20 },

    inputLabel: { 
        fontSize: 11, 
        fontWeight: "800", 
        color: "#1A3C3460", 
        textTransform: "uppercase", 
        marginBottom: 8, 
        marginLeft: 4 
    },
    mainInput: { 
        fontSize: 20, 
        fontWeight: "700", 
        color: "#1A3C34", 
        backgroundColor: "#FFF", 
        borderRadius: 16, 
        padding: 16,
        borderWidth: 1, 
        borderColor: "#EBECEB"
    },

    pillRow: { flexDirection: "row", gap: 12, marginBottom: 30 },

    pillInputBox: { 
        flex: 1, 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#FFF", 
        borderRadius: 14, 
        paddingHorizontal: 15, 
        height: 50, 
        borderWidth: 1, 
        borderColor: "#EBECEB", 
        gap: 8
    },

    smallInput: { fontWeight: "600", color: "#1A3C34", flex: 1, fontSize: 14 },
    sectionHeader: { marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "800", color: '#1A3C34' },
    sectionSubtitle: { fontSize: 12, color: '#1A3C3450', fontWeight: "600" },

    deleteBtn: { 
        marginTop: 35, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 10, 
        padding: 18, 
        borderRadius: 18, 
        backgroundColor: "#FFF", 
        borderWidth: 1, 
        borderColor: "#FFE5E5" 
    },

    deleteText: { color: "#FF5252", fontWeight: "700", fontSize: 14 },

    careRow: { 
        flexDirection: "row", 
        alignItems: "center", 
        backgroundColor: "#FFF", 
        padding: 12, 
        borderRadius: 20, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: "#F0F0F0"
    },

    careRowEnabled: { borderColor: "#E0E8E0", backgroundColor: "#F9FCF9" },

    careIconContainer: { 
        width: 48, 
        height: 48, 
        borderRadius: 14, 
        justifyContent: "center", 
        alignItems: "center", 
        marginRight: 16 
    },

    careTextContainer: { flex: 1 },
    careTitle: { fontWeight: "700", fontSize: 16, color: "#1A3C34" },
    careSubtitle: { fontSize: 13, color: "#8E918E", marginTop: 2 },

});


export default EditPlantModal;
