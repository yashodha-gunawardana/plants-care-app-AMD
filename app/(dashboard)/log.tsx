import { useLocalSearchParams, useRouter } from "expo-router"




const WateringHistoryScreen = () => {
    const router = useRouter();

    const params = useLocalSearchParams();

    // get plantId from url or modal
    const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;


}