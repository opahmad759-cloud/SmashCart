"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "smashcart-auth";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // when the site opens, load the saved login from the browser
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                setUser(data.user);
                setToken(data.token);
            }
        } catch {
            // ignore: the user just starts logged out
        }
        setLoaded(true);
    }, []);

    function login(newToken, newUser) {
        setToken(newToken);
        setUser(newUser);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
        } catch {
            // ignore
        }
    }

    function logout() {
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
    }

    // used when the user changes their name (the token stays the same)
    function updateUser(newUser) {
        setUser(newUser);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: newUser }));
        } catch {
            // ignore
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, loaded, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}