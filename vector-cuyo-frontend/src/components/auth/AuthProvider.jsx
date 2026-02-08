
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const storedUser = localStorage.getItem('dtf_user');
        if (storedUser) {
            try {
                let parsed = JSON.parse(storedUser);
                // Normalize data structure if coming from n8n array
                if (Array.isArray(parsed)) parsed = parsed[0];
                if (parsed.json) parsed = parsed.json;

                setUser(parsed);
            } catch (e) {
                console.error("Session parse error", e);
                localStorage.removeItem('dtf_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Cleanup n8n structure if needed
        let cleanUser = userData;
        if (Array.isArray(userData)) cleanUser = userData[0];
        if (cleanUser.json) cleanUser = cleanUser.json;

        setUser(cleanUser);
        localStorage.setItem('dtf_user', JSON.stringify(cleanUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dtf_user');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
