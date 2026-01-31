import { PlantContext } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");

type CareType = "watering" | "light" | "temp" | "fertilize" | "repot";


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
    const [activeCare, setActiveCare] = useState<CareType | null>(null);
}