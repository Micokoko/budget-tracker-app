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


    const [date, setDate] = useState(query.get('month') || new Date().toISOString().slice(0, 7));
    const [error, setError] = useState('');

    const calculateTotals = (entries) => {
        const totalIncome = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Income' ? Number(entry.amount) : 0), 0);
        const totalExpense = entries.reduce((sum, entry) => sum + (entry.entry_type === 'Expense' || entry.entry_type === 'Liability' ? Number(entry.amount) : 0), 0);
        return { totalIncome, totalExpense };
    };

    const handleMonthChange = (event) => {
        const newMonth = event.target.value;
        setDate(newMonth);
        navigate(`/dashboard?month=${newMonth}`); 
    };

    const handleMonthChangeArrows = (change) => {
        const currentMonth = new Date(date + '-01'); 
        currentMonth.setMonth(currentMonth.getMonth() + change); 
        const newMonth = currentMonth.toISOString().slice(0, 7); 
    

        setDate(newMonth);
        navigate(`/dashboard?month=${newMonth}`); 
        fetchEntriesByUsername(userName, newMonth);
    };


    const { totalIncome, totalExpense } = calculateTotals(entries);
    const totalIncomeLessExpense = totalIncome - totalExpense;

    useEffect(() => {
        const fetchEntries = async () => {
            if (!userName) return; 
            try {
                const data = await fetchEntriesByUsername(userName);
                const filteredEntries = data.filter(entry => entry.date.startsWith(date)); 
                setEntries(filteredEntries);
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

    const formattedDay = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short' };
        const dayOfWeek = date.toLocaleDateString('en-US', options);
        const dayNumber = parseInt(dateString.split('-')[2], 10);
        return `${dayOfWeek}, ${dayNumber}`; 
    };
    
    

    return (
        <div className="flex flex-col w-full max-w-md bg-custom-shiba-secondary rounded-lg shadow-lg border-4 overflow-y-auto border-custom-shiba-tertiary mx-auto min-h-screen sm:min-h-[80vh] md:min-h-[60vh] lg:min-h-[50vh]">
            <div className="p-4 bg-custom-shiba-quaternary border-gray-300">
                <div className="flex justify-center mb-4"> 
                    <div className="bg-custom-shiba-quinary border-gray-300 rounded-lg shadow-md p-4 w-full">
                        {userName && <h2 className="text-xl font-bold">Hello, {userName}!</h2>}
                        <div className="flex justify-between mt-2">
                            <p className="text-lg">Cash: {formatCurrency(cash)}</p>
                            <p className="text-lg">Liabilities: {formatCurrency(liabilities)}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 w-1/3"
                            >
                                Log Out
                            </button>
                            <button
                                onClick={handleEntryAddition}
                                className="px-4 py-2 font-bold text-2xl text-white bg-blue-600 rounded-full w-12 h-12 hover:bg-blue-700 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-4 bg-custom-shiba-secondary rounded-2xl">
                    <button onClick={() => handleMonthChangeArrows(-1)} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <input
                        type="month"
                        className="text-center border-0 bg-transparent p-2"
                        value={date}
                        onChange={handleMonthChange}
                    />
                    <button onClick={() => handleMonthChangeArrows(1)} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </div>

            <div className="flex-1 overflow-y-auto" style={{ minHeight: '400px', maxHeight: '600px' }}>
                <table className="table-fixed w-full">
                    <thead>
                        <tr className="bg-custom-shiba-quinary">
                            <th className="py-2 font-semibold">Category</th>
                            <th className="py-2 font-semibold w-36">Description</th>
                            <th className="py-2 font-semibold">Income</th>
                            <th className="py-2 font-semibold">Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            Object.entries(entries.sort((a, b) => new Date(a.date) - new Date(b.date)).reduce((acc, entry) => {
                                    const dateKey = entry.date.split('-').join('-');
                                    if (!acc[dateKey]) {
                                        acc[dateKey] = [];
                                    }
                                    acc[dateKey].push(entry);
                                    return acc;
                                }, {}))
                                .map(([date, entriesForDate]) => (
                                    <React.Fragment key={date}>
                                        <tr className="bg-custom-shiba-main border-1 border-gray-600">
                                            <td colSpan="4" className="py-2">
                                                <div className='pl-2 font-semibold text-center text-sm break-words whitespace-normal'>
                                                    {formattedDay(date)}
                                                </div>
                                            </td>
                                        </tr>
                                        {entriesForDate.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="border-b cursor-pointer hover:bg-yellow-100"
                                                onClick={() => handleEntryClick(entry)}
                                            >
                                                <td className="py-2">
                                                    <div className='pl-2 font-semibold text-left text-sm break-words whitespace-normal'>{entry.category}</div>
                                                </td>
                                                <td className="py-2 break-words whitespace-normal">
                                                    <div className='font-semibold text-sm'>{entry.description}</div>
                                                    <div className='font-light text-xs'>{entry.entry_type}</div>
                                                </td>
                                                <td className={`py-2 font-medium text-center text-sm ${entry.entry_type === 'Income' ? 'text-blue-700' : ''}`}>
                                                    {entry.entry_type === 'Income' ? formatCurrency(entry.amount) : '-'}
                                                </td>
                                                <td className={`py-2 font-medium break-words text-sm text-center ${
                                                    entry.entry_type === 'Expense' || entry.entry_type === 'Liability'
                                                        ? 'text-red-700'
                                                        : entry.entry_type === 'Settlement'
                                                            ? 'text-fuchsia-600'
                                                            : ''
                                                }`}>
                                                    {entry.entry_type === 'Expense' || entry.entry_type === 'Liability' || entry.entry_type === 'Settlement'
                                                        ? formatCurrency(entry.amount)
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center px-4 py-2">No entries found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>



            <div className="p-3 bg-custom-shiba-quinary border-t border-gray-300 mt-auto">
                <div className="flex justify-between justify-items-center space-x-4 px-8">
                    <div className="text-center font-medium text-l">Income:
                        <div className='font-semibold text-blue-700'>{formatCurrency(totalIncome)}</div>
                    </div>
                    <div className="text-center font-medium text-l">Expense:
                        <div className='font-bold text-red-700'>{formatCurrency(totalExpense)}</div>
                    </div>
                    <div className="text-center font-medium text-l">Total:
                        <div className='font-bold'>{formatCurrency(totalIncomeLessExpense)}</div>
                    </div>
                </div>
            </div>
        </div>

            );
            
        }

export default UserPage;
