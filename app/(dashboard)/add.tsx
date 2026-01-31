import { Dimensions } from "react-native";


const { width } = Dimensions.get("window");

type CareType = "watering" | "light" | "temp" | "fertilize" | "repot";


interface ScheduleConfig {
    interval: number;
    selectedDays: number[];
    selectedTime: string;
}