import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchEntriesByUsername } from '../services/api';

function UserPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const [entries, setEntries] = useState([]);
    const [cash, setCash] = useState(Number(localStorage.getItem('cash')) || 0);
    const [liabilities, setLiabilities] = useState(Number(localStorage.getItem('liabilities')) || 0);
    const userName = localStorage.getItem('username');


    const [date, setDate] = useState(query.get('date') || new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const calculateTotals = (entries) => {
        const totalIncome = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Income' ? Number(entry.amount) : 0), 0);
        const totalExpense = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? Number(entry.amount) : 0), 0);
        return { totalIncome, totalExpense };
    };

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setDate(newDate);
        navigate(`/dashboard?date=${newDate}`); 
    };

    const { totalIncome, totalExpense } = calculateTotals(entries);
    const totaIncomeLessExpense = totalIncome - totalExpense;

    useEffect(() => {
        const fetchEntries = async () => {
            if (!userName || !date) return; 
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
        <div className="flex flex-col w-full max-w-md bg-custom-shiba-secondary rounded-lg shadow-lg border-4 border-custom-shiba-tertiary mx-auto min-h-screen sm:min-h-[80vh] md:min-h-[60vh] lg:min-h-[50vh]">
            <div className="p-4 bg-custom-shiba-quaternary border-gray-300">
                <div className="flex justify-center mb-2">
                    <div className="bg-custom-shiba-quinary border-gray-300 rounded-lg shadow-md p-4 w-full">
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
                        className="border rounded-3xl text-center p-2 bg-custom-shiba-secondary"
                        value={date} 
                        onChange={handleDateChange} 
                    />
                    <button
                        onClick={handleEntryAddition}
                        className="ml-2 px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        + Add Entry
                    </button>
                </div>
                {error && <p className="text-red-600 text-center mt-2">{error}</p>} 
            </div>
    
            <div className="flex-1 overflow-y-auto" style={{ minHeight:'400px', maxHeight: '600px'}}>
                <table className="table-auto w-full">
                    <thead>
                        <tr className="bg-custom-shiba-quinary">
                            <th className="px-4 py-2 font-semibold">Description</th>
                            <th className="px-4 py-2 font-semibold">Income</th>
                            <th className="px-4 py-2 font-semibold">Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <tr
                                    key={entry.id}
                                    className="border-b cursor-pointer hover:bg-yellow-100"
                                    onClick={() => handleEntryClick(entry)}
                                >
                                    <td className="px-4 py-2">
                                        <div className='font-semibold text-lg'>{entry.description}</div>
                                        <div className='font-light text-s'>{entry.entry_type}</div>
                                    </td>
                                    <td className={`px-4 py-2 font-medium ${entry.entry_type === 'Income' ?  'text-blue-700': ''}`}>
                                        {entry.entry_type === 'Income' ? formatCurrency(entry.amount):'-'} 
                                    </td>
                                    <td className={`px-4 py-2 font-medium ${
                                            entry.entry_type === 'Expense' || entry.entry_type === 'Liability'
                                            ? 'text-red-700'
                                            : entry.entry_type === 'Settlement'
                                            ? 'text-fuchsia-600'
                                            : ''
                                        }`}
                                    >
                                        {entry.entry_type === 'Expense' || entry.entry_type === 'Liability' || entry.entry_type === 'Settlement'
                                            ? formatCurrency(entry.amount)
                                            : '-'}
                                    </td>
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
    
            <div className="p-4 bg-custom-shiba-quinary border-t border-gray-300 mt-auto">
                <div className="flex justify-between justify-items-center space-x-4 px-8">
                    <div className="text-center font-medium text-l">Income: 
                        <div className='font-semibold text-blue-700'>{formatCurrency(totalIncome)}</div>
                    </div>
                    <div className="text-center font-medium text-l">Expense:
                        <div className='font-bold text-red-700'>{formatCurrency(totalExpense)}</div>
                    </div>
                    <div className="text-center font-medium text-l">Total: 
                        <div className='font-bold'>{formatCurrency(totaIncomeLessExpense)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default UserPage;
