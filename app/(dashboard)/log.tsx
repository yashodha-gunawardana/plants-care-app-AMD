import { PlantContext } from "@/context/PlantContext";
import { useLocalSearchParams, useRouter } from "expo-router"
import { useContext } from "react";




const WateringHistoryScreen = () => {
    const router = useRouter();

    const params = useLocalSearchParams();

    // get plantId from url or modal
    const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;

    // get plants data and update function from plantContext
    const { plants, loading, updatePlantData } = useContext(PlantContext);

    // find the relevant plants using id
    const plant = plants.find(p => p.id === plantId);
}
