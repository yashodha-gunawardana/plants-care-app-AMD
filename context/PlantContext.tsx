import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { createPlant, getUserPlants, deletePlant, updatePlant } from "@/services/plantService";
import { cancelPlantNotifications } from "@/services/notificationService";


// define the schedule structure
export interface CareSchedule {
    interval: number;
    selectedDays: number[];
    selectedTime: string;
}

export interface Plant {
    id?: string;
    name: string;
    type: string;
    location?: string;
    photo?: string;
    // added this to store our care data
    careSchedules?: {
        watering?: CareSchedule | null;
        light?: CareSchedule | null;
        temp?: CareSchedule | null;
        fertilize?: CareSchedule | null;
        report?: CareSchedule | null;
    };
    lastWatered?: string;
    wateringHistory?: string[];
}


interface PlantContextProps {
    plants: Plant[];
    loading: boolean;

    fetchPlants: () => Promise<void>;
    addPlant: (plantData: Plant, imageUri?: string) => Promise<void>;
    updatePlantData: (plantId: string, updatedData: Partial<Plant>, addWateringHistory?: boolean) => Promise<void>;
    removePlant: (plantId: string) => Promise<void>;
}


export const PlantContext = createContext<PlantContextProps>({} as PlantContextProps);


interface Props {
    children: ReactNode;
}


export const PlantProvider: React.FC<Props> = ({ children }) => {
    const { user } = useContext(AuthContext);   

    const [plants, setPlants] = useState<Plant[]>([]); 
    const [loading, setLoading] = useState<boolean>(true); 

    const [searchQuery, setSearchQuery] = useState<string>("");


    // fetch all plants for current user
    const fetchPlantsData = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const data = await getUserPlants();
            setPlants(data);

        } catch (err: any) {
            console.log("Error fetching plants:", err.message);
        
        } finally {
            setLoading(false);
        }
    };


    // add a new plant
    const addPlant = async (plantData: Plant, localImageUri?: string) => {
        if (!user) return; 

        try {
            await createPlant(plantData, localImageUri);  // upload plant to Firestore + Storage
            await fetchPlantsData();  
                               
        } catch (err: any) {
            console.log("Error adding plant:", err.message);
        }
    };


    // update plants
    const updatePlantData = async (plantId: string, updatedData: Partial<Plant>, addWateringHistory?: boolean) => {
        try {
            // cancel old notifications first to prevent double-alerts after an update
            await cancelPlantNotifications(plantId);

            await updatePlant(plantId, updatedData, addWateringHistory);

            setPlants(prev =>
            prev.map(p => {
                if (p.id === plantId) {
                    let newPlant = { ...p, ...updatedData };

                    // if watering, also update local wateringHistory
                    if (addWateringHistory && updatedData.lastWatered) {
                        newPlant.wateringHistory = [updatedData.lastWatered, ...(p.wateringHistory || [])];
                    }
                    return newPlant;
                }
                return p;
            })
        );

        } catch (err: any) {
            console.log("Error updating plant:", err.message)
        }
    };


    // delete plant
    const removePlant = async (plantId: string) => {
        try {
            //stop all future alerts for this plant
            await cancelPlantNotifications(plantId);

            await deletePlant(plantId);                
            setPlants(prev => prev.filter(p => p.id !== plantId));  // remove from local state

        } catch (err: any) {
            console.log("Error deleting plant:", err.message);
        }
    };


    // search logic
    const filteredPlants = useMemo(() => {
        if (!searchQuery.trim()) return plants;

        const query = searchQuery.toLowerCase();

        return plants.filter(plant =>
            plant.name.toLowerCase().includes(query) ||
            plant.type.toLowerCase().includes(query) ||
            (plant.location?.toLocaleLowerCase().includes(query) ?? false)
        );
    }, [plants, searchQuery]);


    useEffect(() => {
        if (user) fetchPlantsData();
        else setPlants([]); // clear plants if no user logged in
    }, [user]);


    return (
        <PlantContext.Provider
            value={{
                plants,
                loading,
                
                fetchPlants: fetchPlantsData,
                addPlant,
                updatePlantData,
                removePlant,
            }}>
            {children}
        </PlantContext.Provider>
    );
};