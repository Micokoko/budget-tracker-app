import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState(null);
    const [entries, setEntries] = useState([]); 

    const addEntry = (newEntry) => {
        setEntries((prevEntries) => [...prevEntries, newEntry]);
    };

    return (
        <UserContext.Provider value={{ username, setUsername, entries, addEntry }}>
            {children}
        </UserContext.Provider>
    );
};
