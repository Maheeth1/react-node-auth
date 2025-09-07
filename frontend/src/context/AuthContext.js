// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios to send cookies with every request
    axios.defaults.withCredentials = true;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

    useEffect(() => {
        axios.get(`${API_URL}/check-session`)
            .then(res => { 
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                }
            })
            .catch(err => console.error("Session check failed:", err))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        setUser(response.data.user);
        return response;
    };

    const register = async (email, password) => {
        return axios.post(`${API_URL}/register`, { email, password });
    };

    const logout = async () => {
        await axios.post(`${API_URL}/logout`);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };