import { useLocalSearchParams } from "expo-router";
import { Dimensions } from "react-native";



const { width, height } = Dimensions.get("window");

const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/736x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantDetailsModal = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
}