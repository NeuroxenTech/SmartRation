import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../be/service';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load initial global data
    useEffect(() => {
        const loadData = async () => {
            try {
                const itemsData = await api.getAllItems();
                setItems(itemsData);
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <DataContext.Provider value={{ items, loading }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
