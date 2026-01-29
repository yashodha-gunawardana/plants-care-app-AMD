interface AuthContextProps {
    user: any | null;                     
    loading: boolean;       // loading while checking auth state
    login: (email: string, password: string) => Promise<void>;
    register: (fullname: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}