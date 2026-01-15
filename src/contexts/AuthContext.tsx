// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch permissions from the API once when the component mounts
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}whoami`);
                setPermissions(response.data);
            } catch (error) {
                setError('Failed to fetch permissions');
                console.error('Failed to fetch permissions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    return (
        <AuthContext.Provider value={{ permissions, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
