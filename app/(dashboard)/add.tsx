import { PlantContext } from "@/context/PlantContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
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

    const { addPlant } = useContext(PlantContext);
}