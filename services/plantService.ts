import { auth, db, storage } from "@/config/firebase";
import { addDoc, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
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
        
        const data = new FormData();
    }

    return await addDoc(collection(db, "plants"), {
        ...plantData,    // plant form data
        photo: imageUrl,
        userId: user.uid,
        createdAt: new Date().toISOString(),
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
            wateringInterval: data.wateringInterval,
            lastWatered: data.lastWatered,
            photo: data.photo,
            location: data.location,
            notes: data.notes,
            userId: data.userId,
            createdAt: data.createdAt || new Date().toISOString(), // required for TS
        } as Plant;
    });

    return plants;
};


// update plants
export const updatePlant = async (plantId: string, updatedData: any) => {
    const plantRef = doc(db, "plants", plantId);

    return await updateDoc(plantRef, updatedData);
};


// remove plants
export const deletePlant = async (plantId: string) => {
    const plantRef = doc(db, "plants", plantId);

    return await deleteDoc(plantRef);
};