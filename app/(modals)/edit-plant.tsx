import { PlantContext } from "@/context/PlantContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Dimensions } from "react-native";

 
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
}



