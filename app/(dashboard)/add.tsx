import { PlantContext, Plant } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions, View, StyleSheet, TouchableOpacity, Text, Switch, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput, ActivityIndicator } from "react-native";
import * as ImagePicker  from "expo-image-picker";
import { requestNotificationPermissions, scheduleAllPlantReminders } from "@/services/notificationService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DashboardHeader from "@/components/Header";
import Toast from "@/components/Toast";

const { width } = Dimensions.get("window");

type CareType = "watering" | "light" | "temp" | "fertilize" | "report";


// structure for a single care activity's schedule
interface ScheduleConfig {
    interval: number;
    selectedDays: number[];
    selectedTime: string;
}


const AddPlantScreen = () => {
    const router = useRouter();

    // access the global plant context to save new data
    const { addPlant } = useContext(PlantContext);

    const [plantPhoto, setPlantPhoto] = useState<string | null>(null);
    const [plantName, setPlantName] = useState("");
    const [plantType, setPlantType] = useState("");
    const [location, setLocation] = useState("");

    const [isModalVisible, setIsModalVisible] = useState(false);

    // tracks which care item is being edited
    const [activeCare, setActiveCare] = useState<CareType | null>(null);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "info" as "success" | "error" | "info",
    });

    const [reminders, setReminders] = useState({
        watering: false,
        light: false,
        temp: false,
        fertilize: false,
        report: false
    });


    // saved Schedules for each care activity
    const [careSchedules, setCareSchedules] = useState<Record<CareType, ScheduleConfig>>({
        watering: { interval: 0, selectedDays: [], selectedTime: "" },
        light: { interval: 0, selectedDays: [], selectedTime: "" },
        temp: { interval: 0, selectedDays: [], selectedTime: "" },
        fertilize: { interval: 0, selectedDays: [], selectedTime: "" },
        report: { interval: 0, selectedDays: [], selectedTime: "" }
    });


    // temporary state for modal before applying 
    const [modalConfig, setModalConfig] = useState({
        interval: 0,
        selectedOption: "",
        selectedDays: [] as number[],
        selectedTime: "09:00"
    });

    const careConfigs: Record<CareType, any> = {
        watering: { title: "Watering", icon: "water-outline", color: "#4CAF50", unit: "days", options: [{ label: "Daily", value: "1" }, { label: "Weekly", value: "7" }] },
        light: { title: "Light", icon: "sunny-outline", color: "#4CAF50", unit: "hours", options: [{ label: "Low", value: "4" }, { label: "High", value: "12" }] },
        temp: { title: "Temperature", icon: "thermometer", color: "#4CAF50", unit: "°C", isMaterial: true, options: [{ label: "Cool", value: "18" }, { label: "Warm", value: "25" }] },
        fertilize: { title: "Fertilize", icon: "seed-outline", color: "#4CAF50", isMaterial: true, unit: "weeks", options: [{ label: "Bi-weekly", value: "2" }, { label: "Monthly", value: "4" }] },
        report: { title: "Repot", icon: "shovel", color: "#4CAF50", isMaterial: true, unit: "months", options: [{ label: "Yearly", value: "12" }] },
    };


    // function to request camera access and take a photo
    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== "granted") {
            Alert.alert(
                "Permission denied", 
                "Camera permission is required"
            );
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ 
            quality: 0.7, 
            allowsEditing: true 
        });

        if (!result.canceled) setPlantPhoto(result.assets[0].uri);
    };


    const toggleCare = (key: CareType) => {
        if (!reminders[key]) {

            setActiveCare(key);
            const current = careSchedules[key];

                setModalConfig({
                    interval: current.interval,
                    selectedDays: current.selectedDays,
                    selectedTime: current.selectedTime || "09:00",
                    selectedOption: "",
                });
                setIsModalVisible(true);

        } else {
            setReminders(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleAppSchedule = () => {
        if (modalConfig.interval === 0 || modalConfig.selectedDays.length === 0) {
            Alert.alert(
                "Required Fields",
                "Please select an interval and at least one day.."
            );
            return;
        }

        if (activeCare) {
            // apply the selected schedule: if a care type is active, update its interval, days, 
            // and time in the main careSchedules,  enable its reminder, and then close the modal.
            setCareSchedules(prev => ({
                ...prev,
                [activeCare]: {
                    interval: modalConfig.interval,
                    selectedDays: modalConfig.selectedDays,
                    selectedItem: modalConfig.selectedTime
                }
            }));
            setReminders(prev => ({
                ...prev,
                [activeCare]: true
            }));
        }
        setIsModalVisible(false);
    };


    // handles the custom horizontal slider math for selecting intervals
    const handleTrackPress = (event: any) => {
        const { locationX } = event.nativeEvent;
        const trackWidth = width - 120; 
        const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
        const newValue = Math.round(percentage * 30) || 1;
        setModalConfig(prev => ({ 
            ...prev, 
            interval: newValue, 
            selectedOption: "" 
        }));
    };


    const resetForm = () => {
        setPlantPhoto(null);
        setPlantName("");
        setPlantType("");
        setLocation("");
        setReminders({ 
            watering: false, 
            light: false, 
            temp: false, 
            fertilize: false, 
            report: false 
        });
        setCareSchedules({
            watering: { interval: 0, selectedDays: [], selectedTime: "" },
            light: { interval: 0, selectedDays: [], selectedTime: "" },
            temp: { interval: 0, selectedDays: [], selectedTime: "" },
            fertilize: { interval: 0, selectedDays: [], selectedTime: "" },
            report: { interval: 0, selectedDays: [], selectedTime: "" },
        });
        setModalConfig({ interval: 0, selectedOption: "", selectedDays: [], selectedTime: "09:00" });
        setActiveCare(null);
        setIsModalVisible(false);
    };


    const handleAddPlant = async () => {
        if (!plantName.trim()) {
            
            setToast({
                visible: true,
                message: "Plant name is required",
                type: "error"
            });
            setTimeout(() =>
                setToast(p => ({ ...p, visible: false})
            ), 2500);

            return;
        }
        setLoading(true);

        try {
            // plant object with enabled schedules only
            const newPlant: Plant = {
                name: plantName,
                type: plantType,
                location: location || "Living Room",
                careSchedules: {
                    watering: reminders.watering ? careSchedules.watering : undefined,
                    light: reminders.light ? careSchedules.light : undefined,
                    temp: reminders.temp ? careSchedules.temp : undefined,
                    fertilize: reminders.fertilize ? careSchedules.fertilize : undefined,
                    report: reminders.report ? careSchedules.report : undefined,
                }
            };

            // remove undefined fields
            const cleanPlantData = JSON.parse(JSON.stringify(newPlant));

            await addPlant(cleanPlantData, plantPhoto ?? undefined);

            resetForm();

            setToast({
                visible: true,
                message: `${plantName} added successfully 🌿`,
                type: "success"
            });

            // handle Notifications in the background
            try {
                await requestNotificationPermissions();
                await scheduleAllPlantReminders(cleanPlantData);

            } catch (NotifiErr) {
                console.error("Notification scheduling failed: ", NotifiErr);
            }

            setTimeout(() => {
                router.replace("/(dashboard)/home");
            }, 400);

        } catch (err) {
            console.log("Plant save error: ", err);
            setToast({
                visible: true,
                message: "Plant save failed..Try againg",
                type: "error"
            });

        } finally {
            setLoading(false);
            setTimeout(() =>
                setToast(p => ({ ...p, visible: false})
            ), 2500);
        }
    };


    // sub-component for rendering individual care options
    const CareRow = ({ type }: { type: CareType }) => {
        const config = careConfigs[type];
        const isEnabled = reminders[type];
        const schedule = careSchedules[type];

        return (
            <View style={styles.careRow}>
                <TouchableOpacity
                    style={[styles.careIconContainer, isEnabled && { borderColor: config.color }]}
                    onPress={() => {
                        setActiveCare(type);
                        setModalConfig({ ...schedule, selectedOption: "" });
                        setIsModalVisible(true);
                    }}>
                    
                    {config.isMaterial ? (
                        <MaterialCommunityIcons 
                            name={config.icon} 
                            size={22} 
                            color={isEnabled ? config.color : "#1A3C34"}
                        />
                    ) : (
                        <MaterialCommunityIcons
                            name={config.icon}
                            size={22}
                            color={isEnabled ? config.color : "#1A3C34"}
                        />
                    )}
                </TouchableOpacity>

                {/* text lables */}
                <View style={styles.careTextContainer}>
                    <Text style={styles.careTitle}>{config.title}</Text>
                    <Text style={styles.careSubtitle}>
                        {isEnabled ? `Every ${schedule.interval} ${config.unit}` : "No schedule set"}
                    </Text>
                </View>

                {/* switch reminder */}
                <Switch
                    value={isEnabled}
                    onValueChange={() => toggleCare(type)}
                    trackColor={{ false: "#EEE", true: "#C6F062" }}
                    thumbColor={isEnabled ?"#1A3C34" : "#f4f3f4"}>
                </Switch>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <DashboardHeader />

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
            />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={[styles.scrollContent, {paddingBottom: 180 }]}>

                    {/* bg curve */}
                    <View style={styles.headerCurve} />

                    {/* image picker */}
                    <View style={styles.imageContainer}>
                        <View style={styles.imageCircle}>
                            {plantPhoto ? (
                                <Image source={{ uri: plantPhoto }} style={styles.mainImage} />
                            ) : (
                                <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/628/628283.png" }} style={styles.placeholderIcon} />
                            )}

                            <TouchableOpacity
                                style={styles.cameraFab}
                                onPress={pickImage}>

                                <Ionicons 
                                    name="camera-outline"
                                    size={20}
                                    color="#1A3C34"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* form field */}
                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.nameInput}
                            placeholder="Plant's Name"
                            placeholderTextColor="#1A3C3480"
                            value={plantName}
                            onChangeText={setPlantName}
                        />

                        <View style={styles.row}>
                            <View style={styles.pillInputContainer}>
                                <TextInput 
                                    style={styles.pillTextInput}
                                    placeholder="Add Type"
                                    value={plantType}
                                    onChangeText={setPlantType}
                                />
                                <Ionicons name="add" size={18} color="#1A3C34"/>
                            </View>

                            <View style={styles.pillInputContainer}>
                                <TextInput
                                    style={styles.pillTextInput}
                                    placeholder="Add Location"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                                <Ionicons name="add" size={18} color="#1A3C34" />
                            </View>
                        </View>

                        {/* toggle field */}
                        <Text style={styles.sectionTitle}>Plant care</Text>

                        {(Object.keys(careConfigs) as CareType[]).map(type => (
                            <CareRow key={type} type={type} />
                        ))}

                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* reusable modal */}
            <CareSetupModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                activeCare={activeCare}
                config={activeCare ? careConfigs[activeCare] : null}
                tempConfig={modalConfig}
                setTempConfig={setModalConfig}
                onApply={handleApplySchedule}
                onTrackPress={handleTrackPress}
            />

            {/* loading */}
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#1A3C34" />
                    <Text style={styles.loadingText}>Syncing Garden...</Text>
                    <Text style={styles.loadingSubText}>This will only take a moment</Text>
                </View>
            )}

            {/* save btn */}
            <View style={styles.sideActionContainer}>
                <TouchableOpacity style={styles.verticalBtn} onPress={handleAddPlant} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#1A3C34" />
                ) : (
                    <>
                        <Ionicons name="add-circle" size={26} color="#1A3C34" />
                        <Text style={styles.verticalBtnText}>SAVE</Text>
                    </>
                )}
                </TouchableOpacity>
            </View>
        </View>
    );
}



const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#FFF" },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

    headerCurve: {
        position: "absolute",
        top: -250,
        width: "150%",
        height: 450,
        backgroundColor: "#1A3C34",
        borderBottomLeftRadius: 400,
        borderBottomRightRadius: 400,
        alignSelf: "center",
        zIndex: -1,
    },

    imageContainer: { alignItems: "center", marginBottom: 30 },
    
    imageCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

    mainImage: { width: "100%", height: "100%", borderRadius: 90 },
    placeholderIcon: { width: 80, height: 80, opacity: 0.3 },
    
    cameraFab: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#FFF",
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#1A3C3420",
    },

    formContainer: { marginTop: 10 },

    nameInput: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1A3C34",
        borderWidth: 1.5,
        borderColor: "#1A3C34",
        borderRadius: 12,
        padding: 12,
        textAlign: "center",
        marginBottom: 15,
        backgroundColor: "#FFF",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 30,
    },
    pillInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#1A3C34",
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 45,
        backgroundColor: "#FFF",
    },
    pillTextInput: {
        flex: 1,
        color: "#1A3C34",
        fontWeight: "600",
        fontSize: 13,
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#000",
        marginBottom: 20,
    },
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
    sideActionContainer: {
        position: "absolute",
        right: 0,
        top: "45%",
        backgroundColor: "#C6F062",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#1A3C34",
    },
    verticalBtn: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        alignItems: "center",
        gap: 5,
    },
    verticalBtnText: {
        fontSize: 10,
        fontWeight: "900",
        color: "#1A3C34",
    },

    careRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },

    careIconContainer: {
        width: 42,
        height: 42,
        backgroundColor: "#F8F9F8",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },

    careTextContainer: { flex: 1 },
    careTitle: { fontSize: 15, fontWeight: "700", color: "#000" },
    careSubtitle: { fontSize: 11, color: "#888", marginTop: 2 }
});