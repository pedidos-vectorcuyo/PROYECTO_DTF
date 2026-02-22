
import { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister } from '../../services/api';

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

                setUser({
                    ...parsed,
                    role: parsed.correo === 'pedidos@vectorcuyo.com.ar' ? 'admin' : 'user'
                });
            } catch (e) {
                console.error("Session parse error", e);
                localStorage.removeItem('dtf_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Official Admin Bypass
        if (email === 'pedidos@vectorcuyo.com.ar' && password === 'VectorCuyoAdmin2024!_') {
            const adminUser = {
                id: 'admin_official',
                nombre: 'Administrador Vector Cuyo',
                correo: email,
                role: 'admin'
            };
            setUser(adminUser);
            localStorage.setItem('dtf_user', JSON.stringify(adminUser));
            return adminUser;
        }

        try {
            const userData = await apiLogin(email, password);

            // Cleanup n8n structure if needed
            let cleanUser = userData;
            if (Array.isArray(userData)) cleanUser = userData[0];
            if (cleanUser.json) cleanUser = cleanUser.json;

            const userWithRole = {
                ...cleanUser,
                role: cleanUser.correo === 'pedidos@vectorcuyo.com.ar' ? 'admin' : 'user'
            };
            setUser(userWithRole);
            localStorage.setItem('dtf_user', JSON.stringify(userWithRole));
            return userWithRole;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
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
