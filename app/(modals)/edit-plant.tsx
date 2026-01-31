import { Plant, PlantContext } from "@/context/PlantContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions, StyleSheet, TouchableOpacity, View, Text, Switch } from "react-native";

 
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
}


const styles = StyleSheet.create({

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



