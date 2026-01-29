import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { createPlant, getUserPlants, deletePlant, updatePlant } from "@/services/plantService";

export interface Plant {
    id?: string;
    name: string;
    type: string;
    wateringInterval?: number;
    lastWatered?: string;
    photo?: string;
    location?: string;
    notes?: string;
    userId?: string;
    createdAt?: string
}

interface PlantContextProps {
    plants: Plant[];
    loading: boolean;
    fetchPlants: () => Promise<void>;
    addPlant: (plantData: Plant, imageUri?: string) => Promise<void>;
    updatePlantData: (plantId: string, updatedData: Partial<Plant>) => Promise<void>;
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
    const updatePlantData = async (plantId: string, updatedData: Partial<Plant>) => {
        try {
            await updatePlant(plantId, updatedData);
            setPlants(prev =>
                prev.map(p => (p.id === plantId ? { ...p, ...updatedData } : p))
            );

        } catch (err: any) {
            console.log("Error updating plant:", err.message)
        }
    };


    // delete plant
    const removePlant = async (plantId: string) => {
        try {
            await deletePlant(plantId);                
            setPlants(prev => prev.filter(p => p.id !== plantId));  // remove from local state

        } catch (err: any) {
            console.log("Error deleting plant:", err.message);
        }
    };


    useEffect(() => {
        if (user) fetchPlantsData();
        else setPlants([]); // clear plants if no user logged in
    }, [user]);
}