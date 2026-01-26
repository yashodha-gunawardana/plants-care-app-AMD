import { auth, db } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";


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

    await updateProfile(user, {
        displayName: fullname
    });

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullname: fullname,
        email: email,
        createdAt: serverTimestamp() // account creation time
    });

    return user;
};


export const loginUser = async (
    emai: string,
    password: string
) => {

    const userCredential = await signInWithEmailAndPassword(
        auth,
        emai,
        password
    );
}