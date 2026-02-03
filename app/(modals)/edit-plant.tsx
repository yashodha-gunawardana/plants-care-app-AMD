import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { 
    Alert, Dimensions, StyleSheet, TouchableOpacity, View, Text, Switch, 
    KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, TextInput 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CareSetupModal from "@/components/CareModal";
import Toast from "@/components/Toast";


const { width, height } = Dimensions.get("window");
const DEFAULT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


type CareType = "watering" | "light" | "temp" | "fertilize" | "report";


const EditPlantModal = () => {

    const params = useLocalSearchParams();
    const plantId = Array.isArray(params.id) ? params.id[0] : params.id;

    const router = useRouter();

    // access global state and functions from the PlantContext
    const { plants, updatePlantData, removePlant } = useContext(PlantContext);

    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return null;

    const [plantPhoto, setPlantPhoto] = useState<string | null>(plant.photo || null);
    const [plantName, setPlantName] = useState(plant.name || "");
    const [plantType, setPlantType] = useState(plant.type || "");
    const [location, setLocation] = useState(plant.location || "");

    const [isModalVisible, setIsModalVisible] = useState(false);   // controls the care config modal
    const [activeCare, setActiveCare] = useState<CareType | null>(null);   // // tracks which care item is being edited
    const [loading, setLoading] = useState(false); 

    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "info" as "success" | "error" | "info",
    });

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
        if (!plantName.trim()) {
            Alert.alert("Required", "Plant name is needed");
            return;
        }

        try {
            setLoading(true);
            
            const updatedPlant: Partial<Plant> = {
                name: plantName.trim(),
                type: plantType.trim(),
                location: location.trim(),
                photo: plantPhoto || undefined,
                careSchedules: {
                    watering: reminders.watering ? careSchedules.watering : null,
                    light: reminders.light ? careSchedules.light : null,
                    temp: reminders.temp ? careSchedules.temp : null,
                    fertilize: reminders.fertilize ? careSchedules.fertilize : null,
                    report: reminders.report ? careSchedules.report : null,
                }
            };
            await updatePlantData(plantId, updatedPlant);

            setToast({
                visible: true,
                message: `${plantName} updated🌿, Your changes were saved successfully.`,
                type: "success"
            });

            setTimeout(() => {
                setToast(p => ({ ...p, visible: false }));
            }, 2500);

            router.replace({
                pathname: "/(modals)/plant-details",
                params: { id: plantId }   
            });


        } catch (err) {
            console.error("Update failed:", err);
            setToast({
                visible: true,
                message: "Plant update failed.Try againg",
                type: "error"
            });

        } finally {
            setLoading(false);
            setTimeout(() =>
                setToast(p => ({ ...p, visible: false})
            ), 2500);
        }
    };


    const CareRow = ({ type }: { type: CareType }) => {
        const config = careConfigs[type];
        const isEnabled = reminders[type];
        const schedule = (careSchedules as any)[type];

        return (
            <TouchableOpacity
                activeOpacity={0.8}
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

                // care icon box 
                style={styles.careRow}>

                <View style={[styles.careIconBox, { backgroundColor: isEnabled ? config.color : "#EEE" }]}>
                    <Ionicons name={config.icon} size={20} color={isEnabled ? "#FFF" : "#AAA"} />
                </View>

                {/* care text indo */}
                <View style={styles.careInfo}>
                    <Text style={styles.careTitle}>{config.title}</Text>
                    <Text style={styles.careStatus}>
                        {isEnabled ? `Every ${schedule?.interval} ${config.unit}` : "Disabled"}
                    </Text>
                </View>

                {/* toggle switch */}
                <Switch
                    value={isEnabled}
                    onValueChange={() => toggleCare(type)}
                    trackColor={{ false: "#DDD", true: "#A5D6A7" }}
                    thumbColor={isEnabled ? "#1A3C34" : "#F4F4F4"}
                />
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
            />

            {/* Full-screen loading overlay */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1A3C34" />
                    <Text style={styles.loadingText}>Syncing Garden...</Text>
                    <Text style={styles.loadingSubText}>This will only take a moment</Text>
                </View>
            )}

            {/* ensures the keyboard doesn't cover input fields on iOS */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                
                {/* Visual Nature Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.curvedBg} />
                    
                    <SafeAreaView style={styles.navRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
                            <Ionicons name="chevron-down" size={24} color="#1A3C34" />
                        </TouchableOpacity>

                        <Text style={styles.navTitle}>Edit Plant</Text>

                        <TouchableOpacity onPress={handleUpdate} style={styles.saveBtn} disabled={loading}>
                            <Text style={styles.doneBtnText}>Done</Text>
                        </TouchableOpacity>

                    </SafeAreaView>

                    {/* plant image and camera */}
                    <View style={styles.imageWrapper}>
                        <View style={styles.imageBorder}>
                            <Image source={{ uri: plantPhoto || DEFAULT_IMAGE }} style={styles.profileImg} />
                            <TouchableOpacity style={styles.cameraIcon} onPress={async () => {
                                const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true });
                                if (!result.canceled) setPlantPhoto(result.assets[0].uri);
                            }}>
                                <Ionicons name="camera" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* input fields */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.formCard}>
                        {/* Name Input */}
                        <View style={styles.mainInputGroup}>
                            <Text style={styles.label}>Plant Name</Text>
                            <TextInput 
                                style={styles.nameInput} 
                                value={plantName} 
                                onChangeText={setPlantName} 
                                placeholder="E.g. Monstera" 
                                placeholderTextColor="#C0C0C0"
                            />
                        </View>

                        {/* Split Inputs */}
                        <View style={styles.splitRow}>
                            <View style={styles.pillInput}>
                                <Ionicons name="leaf-outline" size={16} color="#1A3C3480" />

                                <TextInput 
                                    style={styles.flexInput} 
                                    value={plantType} 
                                    onChangeText={setPlantType} 
                                    placeholder="Species" 
                                />
                            </View>
                            <View style={styles.pillInput}>
                                <Ionicons name="location-outline" size={16} color="#1A3C3480" />

                                <TextInput 
                                    style={styles.flexInput} 
                                    value={location} 
                                    onChangeText={setLocation} 
                                    placeholder="Location" 
                                />
                            </View>
                        </View>

                        <Text style={styles.subHeading}>Care Schedule</Text>
                        
                        {/* Care Rows */}
                        <View style={styles.careContainer}>
                            {(Object.keys(careConfigs) as CareType[]).map(type => (
                                <CareRow key={type} type={type} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* configuration modal */}
            {isModalVisible && activeCare && (
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
    container: { flex: 1, backgroundColor: "#FFF" },
    headerContainer: { height: 230, width: '100%', alignItems: 'center' },
    curvedBg: {
        position: 'absolute',
        top: -height * 0.1,
        width: width * 1.5,
        height: height * 0.4,
        backgroundColor: '#E8F0E8',
        borderRadius: width,
        transform: [{ scaleX: 1.2 }]
    },
    navRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
    navTitle: { fontSize: 16, fontWeight: '800', color: '#1A3C34', textTransform: 'uppercase', letterSpacing: 1 },
    saveBtn: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, borderWidth: 1, borderColor: '#1A3C3420' },
    doneBtnText: { color: '#1A3C34', fontWeight: '700' },
    
    imageWrapper: { marginTop: 25 },
    imageBorder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5,
        borderColor: '#FFF',
        backgroundColor: '#FFF',
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    profileImg: { width: '100%', height: '100%', borderRadius: 60 },
    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#1A3C34',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },

    scrollContent: { paddingBottom: 50 },
    formCard: { paddingHorizontal: 25, marginTop: 40 },
    mainInputGroup: { marginBottom: 25 },
    label: { fontSize: 12, fontWeight: '800', color: '#7A8A7A', textTransform: 'uppercase', marginBottom: 10 },
    nameInput: { fontSize: 26, fontWeight: '700', color: '#1A3C34', borderBottomWidth: 2, borderBottomColor: '#E8F0E8', paddingBottom: 5 },
    
    splitRow: { flexDirection: 'row', gap: 15, marginBottom: 35 },
    pillInput: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#F9FAF9', 
        paddingHorizontal: 12, 
        height: 45, 
        borderRadius: 12,
        gap: 8
    },
    flexInput: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A3C34' },
    
    subHeading: { fontSize: 18, fontWeight: '800', color: '#1A3C34', marginBottom: 20 },
    careContainer: { backgroundColor: '#FDFDFD' },
    careRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    careIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    careInfo: { flex: 1 },
    careTitle: { fontSize: 15, fontWeight: '700', color: '#1A3C34' },
    careStatus: { fontSize: 12, color: '#7A8A7A', marginTop: 2 },
    
    deleteLink: { marginTop: 40, alignItems: 'center' },
    deleteText: { color: '#FF5252', fontWeight: '600', opacity: 0.6 },

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
    }

});


export default EditPlantModal;