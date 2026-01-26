import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";




export const registerUser = async (
    fullname: string,
    email: string,
    password: string
) => {
    
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    const user = userCredential.user;
}