    import { createContext, useEffect, useState } from "react";
    import { auth } from "../firebase";
    import { 
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword 
    } from "firebase/auth";

    export const AuthContext = createContext();

    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Inscription
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Connexion
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Déconnexion
    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    );
    }