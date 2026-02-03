import { auth, db } from "@/config/firebase";
import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Plant } from "@/context/PlantContext";


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnefdegz0/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_plant_upload";


// add plant
export const createPlant = async (plantData: any, loacalImageUrl?: string) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated..")
    }

    let imageUrl = "";

    if (loacalImageUrl) {
        // create formdata for image upload
        const data = new FormData();

        data.append("file", {
            uri: loacalImageUrl,
            type: "image/jpeg",
            name: "plant.jpg"

        } as any)

        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); 

        try {
            // upload image to cloudinary
            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: data,
            });
            const json = await res.json();
            imageUrl = json.secure_url;
        
        } catch (err) {
            console.log("Cloudinary upload error:", err);
            throw new Error("Failed to upload image to Cloudinary");
        }
    }

    // save plant data in Firestore
    return await addDoc(collection(db, "plants"), {
        ...plantData,    // plant form data
        photo: imageUrl,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        wateringHistory: []
    });
};


// get all plants
export const getUserPlants = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated...")
    }

    // only plants belonging to user
    const q = query(
        collection(db, "plants"),
        where("userId", "==", user.uid)
    );

    // execute query
    const snapshot = await getDocs(q);

    // map Firestore docs to full Plant objects
    const plants: Plant[] = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
            id: doc.id,
            name: data.name || "Unnamed Plant",       
            type: data.type || "Unknown Type",  
            location: data.location,
            photo: data.photo,
            careSchedules: data.careSchedules ?? {},   
            wateringHistory: data.wateringHistory ?? []   
        } as Plant;
    });

    return plants;
};


// update plants
export const updatePlant = async (plantId: string, updatedData: Partial<Plant>, addWateringHistory?: boolean) => {
    const plantRef = doc(db, "plants", plantId);
    
    // remove any undefined keys to prevent Firestore errors
    const cleanData = Object.fromEntries(
        Object.entries(updatedData).filter(([_, v]) => v !== undefined)
    );

    // return await updateDoc(plantRef, cleanData);
    if (addWateringHistory) {
        const oldHistory = Array.isArray(cleanData.wateringHistory)
            ? cleanData.wateringHistory
            : [];

        await updateDoc(plantRef, {
            ...cleanData,
            wateringHistory: [...oldHistory, new Date().toISOString()]
        });
        
    } else {
        await updateDoc(plantRef, cleanData);
    }

};

// remove plants
export const deletePlant = async (plantId: string) => {
    const plantRef = doc(db, "plants", plantId);

    return await deleteDoc(plantRef);
};

