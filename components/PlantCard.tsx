import { Plant } from "@/context/PlantContext";
import { useRouter } from "expo-router";


interface PlantCardProps {
    item: Plant
};


const DEFAULT_PLANT_IMAGE = "https://i.pinimg.com/1200x/9b/77/f6/9b77f61cdb7dffbd979b1d7b02cfa937.jpg";


const PlantCard = ({ item }: PlantCardProps) => {
    const router = useRouter();

    // render small status icons 
    const renderCareBadges = () => {
        const schedules = item.careSchedules;

        if (!schedules) return null;

        const activeSchedules = [
            { key: 'watering', val: schedules.watering, icon: 'water', color: '#4A90E2', bg: '#E1F5FE', unit: 'd' },
            { key: 'fertilize', val: schedules.fertilize, icon: 'leaf', color: '#4CAF50', bg: '#E8F5E9', unit: 'w', isMaterial: true },
            { key: 'repot', val: schedules.report, icon: 'shovel', color: '#795548', bg: '#EFEBE9', unit: 'm', isMaterial: true },
        ];
    }
}