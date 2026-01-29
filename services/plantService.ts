import { auth, db } from "@/config/firebase"
import { addDoc, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";


// add plant
export const createPlant = async (plantData: any) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated..")
    }

    return await addDoc(collection(db, "plants"), {
        ...plantData,    // plant form data
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

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};


// update plants
export const updatePlant = async (plantId: string, updatedData: any) => {
    const plantRef = doc(db, "plants", plantId);

    return await updateDoc(plantRef, updatedData);
}


// remove plants
export const deletePlant = async (plantId: string) => {
    
}