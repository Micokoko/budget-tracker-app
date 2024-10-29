import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEntriesByUsername } from '../services/api';

function UserPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [cash, setCash] = useState(Number(localStorage.getItem('cash')) || 0);
    const [liabilities, setLiabilities] = useState(Number(localStorage.getItem('liabilities')) || 0);
    const userName = localStorage.getItem('username');

    const calculateTotals = (entries) => {
        const totalIncome = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Income' ? Number(entry.amount) : 0), 0);
        const totalExpense = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? Number(entry.amount) : 0), 0);
        return { totalIncome, totalExpense };
    };

    const { totalIncome, totalExpense } = calculateTotals(entries);

    useEffect(() => {
        const fetchEntries = async () => {
            if (!userName) return; 
            try {
                const data = await fetchEntriesByUsername(userName);
                console.log('Fetched entries:', data); 
                setEntries(data);
            } catch (error) {
                console.error("Error fetching entries:", error);
            }
        };

        fetchEntries();
    }, [userName]);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('cash');
        localStorage.removeItem('liabilities');
        navigate('/');
    };

    const handleAddEntry = (newEntry) => {
        let updatedCash = cash;
        let updatedLiabilities = liabilities;

        if (newEntry.entry_type === 'Income') {
            updatedCash += Number(newEntry.amount);
        } else if (newEntry.entry_type === 'Expense' || newEntry.entry_type === 'Liability') {
            updatedLiabilities += Number(newEntry.amount);
        }

        localStorage.setItem('cash', updatedCash);
        localStorage.setItem('liabilities', updatedLiabilities);

        setCash(updatedCash);
        setLiabilities(updatedLiabilities);

        setEntries((prevEntries) => [...prevEntries, newEntry]);
    };

    const handleEntryAddition = () => {
        navigate(`/add-entry?username=${userName}`); 
    };

    // Function to format numbers as pesos
    const formatCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-10 p-4">
                <div className="flex justify-center">
                    <div className="max-w-sm w-full">
                        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                            {userName && <h2 className="text-xl font-bold">Hello, {userName}!</h2>}
                            <div className="flex justify-between mt-2">
                                <p className="text-lg">Cash: {formatCurrency(cash)}</p>
                                <p className="text-lg">Liabilities: {formatCurrency(liabilities)}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed top-40 left-0 right-0 bg-white z-10 p-4">
                <div className="flex justify-between">
                    <input type="date" className="border rounded-md p-2" />
                    <button
                        onClick={handleEntryAddition}
                        className="ml-2 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Add Entry
                    </button>
                </div>
            </div>

            <div className="flex-1 mt-40 pt-16">
                <div className="flex-1">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Expense</th>
                                <th className="px-4 py-2">Income</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length > 0 ? (
                                entries.map((entry, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-6">{entry.description}</td>
                                        <td className="px-4 py-2">{entry.entry_type}</td>
                                        <td className="px-4 py-2">{entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? formatCurrency(entry.amount) : '-'}</td>
                                        <td className="px-4 py-2">{entry.entry_type === 'Income' ? formatCurrency(entry.amount) : '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center px-4 py-2">No entries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-4 z-10">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-l">Total</span>
                    <div className="flex space-x-4">
                        <span className="font-bold text-l">Expense: {formatCurrency(totalExpense)}</span>
                        <span className="font-bold text-l">Income: {formatCurrency(totalIncome)}</span>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
