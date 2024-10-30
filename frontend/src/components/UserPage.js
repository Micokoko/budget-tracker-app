import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEntriesByUsername } from '../services/api';

function UserPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [cash, setCash] = useState(Number(localStorage.getItem('cash')) || 0);
    const [liabilities, setLiabilities] = useState(Number(localStorage.getItem('liabilities')) || 0);
    const userName = localStorage.getItem('username');


    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const calculateTotals = (entries) => {
        const totalIncome = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Income' ? Number(entry.amount) : 0), 0);
        const totalExpense = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? Number(entry.amount) : 0), 0);
        return { totalIncome, totalExpense };
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const { totalIncome, totalExpense } = calculateTotals(entries);

    useEffect(() => {
        const fetchEntries = async () => {
            if (!userName) return; 
            try {
                const data = await fetchEntriesByUsername(userName, date);
                setEntries(data);
                setError(''); 
            } catch (error) {
                console.error("Error fetching entries:", error);
                setError('Failed to fetch entries. Please try again.');
            }
        };

        fetchEntries();
    }, [userName, date]); 

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('cash');
        localStorage.removeItem('liabilities');
        navigate('/');
    };

    const handleEntryAddition = () => {
        navigate(`/add-entry?username=${userName}&date=${date}`);
    };

    const handleEntryClick = (entry) => {
        navigate(`/add-entry?username=${userName}&id=${entry.id}&date=${entry.date}&entry_type=${entry.entry_type}&description=${entry.description}&amount=${entry.amount}`);
    };

    const formatCurrency = (amount) => {
        return `₱${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="flex flex-col h-full border-4 border-gray-300">
            <div className="fixed-top p-4 bg-white border-b border-gray-300">
                <div className="flex justify-center mb-2">
                    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full">
                        {userName && <h2 className="text-xl font-bold">Hello, {userName}!</h2>}
                        <div className="flex justify-between mt-2">
                            <p className="text-lg">Cash: {formatCurrency(cash)}</p>
                            <p className="text-lg">Liabilities: {formatCurrency(liabilities)}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 mt-4 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 w-1/8"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
                <div className="flex justify-between mt-4">
                    <input
                        type="date"
                        className="border rounded-md p-2"
                        value={date} 
                        onChange={handleDateChange} 
                    />
                    <button
                        onClick={handleEntryAddition}
                        className="ml-2 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Add Entry
                    </button>
                </div>
                {error && <p className="text-red-600 text-center mt-2">{error}</p>} 
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="table-auto w-full">
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
                                <tr
                                    key={entry.id} 
                                    className="border-b cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleEntryClick(entry)}
                                >
                                    <td className="px-4 py-2">{entry.description}</td>
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

            <div className="fixed-bottom p-4 bg-white border-t border-gray-300">
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
