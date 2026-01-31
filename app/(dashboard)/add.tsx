import { PlantContext, Plant } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Dimensions } from "react-native";
import * as ImagePicker  from "expo-image-picker";
import { requestNotificationPermissions, scheduleAllPlantReminders } from "@/services/notificationService";

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
        light: { title: "Light", icon: "sunny-outline", color: "#FFB300", unit: "hours", options: [{ label: "Low", value: "4" }, { label: "High", value: "12" }] },
        temp: { title: "Temperature", icon: "thermometer", color: "#FF5722", unit: "°C", isMaterial: true, options: [{ label: "Cool", value: "18" }, { label: "Warm", value: "25" }] },
        fertilize: { title: "Fertilize", icon: "seed-outline", color: "#8BC34A", isMaterial: true, unit: "weeks", options: [{ label: "Bi-weekly", value: "2" }, { label: "Monthly", value: "4" }] },
        report: { title: "Repot", icon: "shovel", color: "#795548", isMaterial: true, unit: "months", options: [{ label: "Yearly", value: "12" }] },
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

        } catch (err) {

        }
    }
}