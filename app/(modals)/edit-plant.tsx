import { useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";

 
const { width } = Dimensions.get("window");

const DEFAULT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";

type CareType = "watering" | "light" | "temp" | "fertilize" | "report";



const EditPlantModal = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
}


