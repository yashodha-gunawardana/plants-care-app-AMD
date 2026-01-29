import { auth, db } from "@/config/firebase"
import { addDoc, collection } from "firebase/firestore";


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
}