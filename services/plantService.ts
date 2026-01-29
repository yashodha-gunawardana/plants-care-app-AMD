import { auth } from "@/config/firebase"

export const createPlant = async (plantData: any) => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User not authenticated..")
    }
}