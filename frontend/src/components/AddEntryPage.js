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
                    setEntryType(entry.entry_type); // Keep this for editing
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
                navigate('/dashboard');
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

        let currentCash = parseFloat(localStorage.getItem('cash')) || 0;
        let currentLiability = parseFloat(localStorage.getItem('liabilities')) || 0;

        const payload = {
            date,
            entry_type: entryType,
            description,
            amount: parseFloat(amount),
        };

        const url = `${API_URL}/entries/${id}?username=${username}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const existingEntry = await getEntryById(id, username);
                updateLocalStorage(currentCash, currentLiability, payload, existingEntry.amount);
                const updatedEntry = await response.json();
                addEntry(updatedEntry);
                navigate('/dashboard');
            } else {
                setError('Failed to update entry');
                console.error('Failed to update entry');
            }
        } catch (err) {
            setError('Failed to update entry due to a network error');
            console.error('Network error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateLocalStorage = (currentCash, currentLiability, payload, oldAmount) => {
        if (payload.entry_type === 'Income') {
            currentCash += (payload.amount - (oldAmount || 0)); 
        } else if (payload.entry_type === 'Expense') {
            currentCash -= (payload.amount - (oldAmount || 0));
        } else if (payload.entry_type === 'Liability') {
            currentLiability += (payload.amount - oldAmount);
        } else if (payload.entry_type === 'Settlement') {
            currentCash -= (payload.amount - oldAmount);
            currentLiability -= (payload.amount - oldAmount);
        }

        localStorage.setItem('cash', currentCash.toFixed(2));
        localStorage.setItem('liabilities', currentLiability.toFixed(2));
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
                if (entryType === 'Income') {
                    currentCash -= amountToRemove; 
                } else if (entryType === 'Expense') {
                    currentCash += amountToRemove; 
                } else if (entryType === 'Liability') {
                    currentLiability -= amountToRemove
                } else if (entryType === 'Settlement') {
                    currentCash += amountToRemove; 
                    currentLiability += amountToRemove

                } else {
                    console.error('Unknown entry type:', entryType);
                }
    

                if (typeof currentCash === 'number' || currentLiability === 'number'  ) {
                    localStorage.setItem('cash', currentCash.toFixed(2));
                    localStorage.setItem('liabilities', currentLiability.toFixed(2));

                } else {
                    throw new Error('Current cash or liability is not a valid number');
                }
    

                await deleteEntryById(id, username);
                navigate('/dashboard');
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
