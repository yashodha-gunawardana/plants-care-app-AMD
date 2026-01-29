import { auth } from "@/config/firebase"
import { addDoc, collection } from "firebase/firestore";

export const createPlant = async (plantData: any) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated..")
    }

    return await addDoc(collection(db, "plants"), {
        
    })
}