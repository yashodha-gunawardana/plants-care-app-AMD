import React, { createContext, ReactNode } from "react";


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