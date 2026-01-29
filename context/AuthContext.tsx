import { auth } from "@/config/firebase";
import { loginUser, registerUser } from "@/services/authService";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
    user: any | null;                     
    loading: boolean;       // loading while checking auth state
    login: (email: string, password: string) => Promise<void>;
    register: (fullname: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// create context
export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

interface Props {
    children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null); // store current user
    const [loading, setLoading] = useState<boolean>(true); // loading state while checking auth
}


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
    });

    return () => unsubscribe();
}, []);


// login function
const login = async (email: string, password: string) => {
    try {
        const loggedUser = await loginUser(email, password);
        setUser(loggedUser);

    } catch (err: any) {
        throw new Error(err.message);
    }
};


// register function
const register = async (fullname: string, email: string, password: string) => {
    try {
        const newUser = await registerUser(fullname, email, password);
        setUser(newUser); 
        
    } catch (error: any) {
        throw new Error(error.message); 
    }
};


// logout function
const logout = async () => {
    try {
        await signOut(auth);   // firebase logout
        setUser(null);

    } catch (err: any) {
        throw new Error(err.message);
    }
};