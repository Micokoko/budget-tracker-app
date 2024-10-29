import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEntriesByUsername } from '../services/api';

function UserPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const userName = localStorage.getItem('username');
    const cash = localStorage.getItem('cash');
    const liabilities = localStorage.getItem('liabilities');

    const totalIncome = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Income' ? entry.amount : 0), 0);
    const totalExpense = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? entry.amount : 0), 0);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const data = await fetchEntriesByUsername(userName);
                console.log('Fetched entries:', data); // Log the data
                setEntries(data);
            } catch (error) {
                console.error("Error fetching entries:", error);
            }
        };
    
        if (userName) fetchEntries();
    }, [userName]);
    

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('cash');
        localStorage.removeItem('liabilities');
        navigate('/');
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 z-10 p-4">
                <div className="flex justify-center">
                    <div className="max-w-sm w-full">
                        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                            {userName && <h2 className="text-xl font-bold">Hello, {userName}!</h2>}
                            <div className="flex justify-between mt-2">
                                <p className="text-lg">Cash: ${cash}</p>
                                <p className="text-lg">Liabilities: ${liabilities}</p>
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

            {/* Add Entry Section */}
            <div className="fixed top-40 left-0 right-0 bg-white z-10 p-4">
                <div className="flex justify-between">
                    <input type="date" className="border rounded-md p-2" />
                    <button
                        onClick={() => navigate(`/add-entry?username=${userName}`)}
                        className="ml-2 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Add Entry
                    </button>
                </div>
            </div>

            {/* Entries Table */}
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
                                        <td className="px-4 py-2">{entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? `$${entry.amount}` : '-'}</td>
                                        <td className="px-4 py-2">{entry.entry_type === 'Income' ? `$${entry.amount}` : '-'}</td>
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
                        <span className="font-bold text-l">Income: ${totalIncome}</span>
                        <span className="font-bold text-l">Expense: ${totalExpense}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
