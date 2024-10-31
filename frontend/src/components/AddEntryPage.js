import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext'; 
import { deleteEntryById, getEntryById, API_URL } from '../services/api';

function AddEntryPage() {
    const navigate = useNavigate();
    const { username, addEntry } = useContext(UserContext);
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const [id, setId] = useState(query.get('id') || '');
    const [date, setDate] = useState(query.get('date') || '');
    const [entryType, setEntryType] = useState('Income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        const fetchEntry = async () => {
            if (id) {
                try {
                    const entry = await getEntryById(id, username); 
                    setDate(entry.date);
                    setEntryType(entry.entry_type); 
                    setDescription(entry.description);
                    setAmount(entry.amount);
                } catch (err) {
                    setError('Failed to fetch entry');
                }
            }
        };
        fetchEntry();
    }, [id, username]);

    const handleAddEntry = async (event) => {
        event.preventDefault();
        if (isSubmitting) return; 
        setIsSubmitting(true);
    
        if (!username) {
            setError('Username is required');
            setIsSubmitting(false);
            return;
        }
    
        const currentCash = parseFloat(localStorage.getItem('cash')) || 0;
        const currentLiability = parseFloat(localStorage.getItem('liabilities')) || 0;
    
        const payload = {
            date,
            entry_type: entryType,
            description,
            amount: parseFloat(amount),
        };
    
        const url = `${API_URL}/entries?username=${username}`;
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                const updatedEntry = await response.json();
                updateLocalStorage(currentCash, currentLiability, payload, 0); 
                addEntry(updatedEntry);
                navigate(`/dashboard?date=${date}`); 
            } else {
                setError('Failed to add entry');
                console.error('Failed to add entry');
            }
        } catch (err) {
            setError('Failed to add entry due to a network error');
            console.error('Network error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEditEntry = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        if (!username) {
            setError('Username is required');
            setIsSubmitting(false);
            return;
        }

        try {
            const existingEntry = await getEntryById(id, username);
            const currentCash = parseFloat(localStorage.getItem('cash')) || 0;
            const currentLiability = parseFloat(localStorage.getItem('liabilities')) || 0;
    
            const payload = {
                date,
                entry_type: entryType,
                description,
                amount: parseFloat(amount),
            };
    
            const url = `${API_URL}/entries/${id}?username=${username}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                updateLocalStorage(currentCash, currentLiability, payload, parseFloat(existingEntry.amount) || 0);
                const updatedEntry = await response.json();
                addEntry(updatedEntry);
                navigate(`/dashboard?date=${date}`);
            } else {
                setError('Failed to update entry');
            }
        } catch (err) {
            setError('Failed to update entry due to a network error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const updateLocalStorage = (currentCash, currentLiability, payload, oldAmount = 0) => {
        let updatedCash = currentCash;
        let updatedLiability = currentLiability;
        let payloadDifference = payload.amount - oldAmount
        
        switch (payload.entry_type) {
            case 'Income':
                updatedCash += payloadDifference;
                break;
            case 'Expense':
                updatedCash -= payloadDifference;
                break;
            case 'Liability':
                updatedLiability += payloadDifference;
                break;
            case 'Settlement':
                updatedCash -= payloadDifference;
                updatedLiability -= payloadDifference;
                break;
            default:
                console.error('Unknown entry type:', payload.entry_type);
                return;
        }
        
        localStorage.setItem('cash', updatedCash.toFixed(2));
        localStorage.setItem('liabilities', updatedLiability.toFixed(2));
    };
    

    const handleDeleteEntry = async () => {
        if (id) {
            if (!username) {
                setError('Username is required');
                return;
            }
    
            try {
                const existingEntry = await getEntryById(id, username);
                const amountToRemove = parseFloat(existingEntry.amount);
                if (isNaN(amountToRemove)) {
                    throw new Error('Invalid amount to remove');
                }
    
                let currentCash = parseFloat(localStorage.getItem('cash'));
                let currentLiability = parseFloat(localStorage.getItem('liabilities'))
    
                if (isNaN(currentCash)) {
                    currentCash = 0;
                }
    
                if (isNaN(currentLiability)) {
                    currentLiability = 0;
                }
    
                const entryType = existingEntry.entry_type;

                switch (entryType){
                    case 'Income':
                        currentCash -= amountToRemove;
                        break;
                    case 'Expense':
                        currentCash += amountToRemove;
                        break
                    case 'Liability':
                        currentLiability -= amountToRemove;
                        break
                    case 'Settlement':
                        currentCash += amountToRemove;
                        currentLiability += amountToRemove;
                    default:
                        console.error('Unknown entry type:', entryType);
                        return
                }
    
                if (typeof currentCash === 'number' || currentLiability === 'number') {
                    localStorage.setItem('cash', currentCash.toFixed(2));
                    localStorage.setItem('liabilities', currentLiability.toFixed(2));
                } else {
                    throw new Error('Current cash or liability is not a valid number');
                }
    
                await deleteEntryById(id, username);
                navigate(`/dashboard?date=${date}`);
            } catch (err) {
                setError('Failed to delete entry');
                console.error('Failed to delete entry', err);
            }
        }
    };
    
    
    
    

    const handleSubmit = (event) => {
        if (id) {
            handleEditEntry(event);
        } else {
            handleAddEntry(event);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">{id ? 'Edit Entry' : 'Add Entry'}</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    {!id && ( 
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="entryType">Entry Type</label>
                            <select
                                id="entryType"
                                value={entryType}
                                onChange={(e) => setEntryType(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                            >
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                                <option value="Liability">Liabilities</option>
                                <option value="Settlement">Settlement</option>
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting} 
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {id ? 'Update Entry' : 'Add Entry'}
                    </button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {id && (
                    <button
                        onClick={handleDeleteEntry}
                        className="mt-4 w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Delete Entry
                    </button>
                )}
            </div>
        </div>
    );
}

export default AddEntryPage;
