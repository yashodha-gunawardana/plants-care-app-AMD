import { Plant } from "@/context/PlantContext";
import { useRouter } from "expo-router";


interface PlantCardProps {
    item: Plant
};


const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantCard = ({ item }: PlantCardProps) => {
    const router = useRouter();


    const renderCareBadges = () => {
        const schedules = item.careSchedules;

        if (!schedules) return null;
    }
}