import React, { createContext, ReactNode, useState } from "react";

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