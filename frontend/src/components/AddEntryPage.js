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
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const categories = {
        Income: ['Salary', 'Allowance', 'Bonus', 'Others'],
        Expense: ['Food', 'Social Life', 'Pets', 'Transporation', 'Shopping', 'Utilities', 'Lifestyle'],
        Liability: ['Loan', 'Mortgage', 'Credit Card', 'Borrowed Money'],
        Settlement: ['Loan Payment', 'Credit Card Payment', 'Agreement']
    };

    useEffect(() => {
        const fetchEntry = async () => {
            if (id) {
                try {
                    const entry = await getEntryById(id, username); 
                    setDate(entry.date);
                    setEntryType(entry.entry_type); 
                    setCategory(entry.category);
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
            category,
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
                category,
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
                        break;
                    case 'Liability':
                        currentLiability -= amountToRemove;
                        break;
                    case 'Settlement':
                        currentCash += amountToRemove;
                        currentLiability += amountToRemove;
                        break;
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
        <div className="flex flex-col px-6 py-8 sm:px-10 sm:py-12 items-center justify-center w-full max-w-md bg-custom-shiba-secondary rounded-lg shadow-lg border-4 border-custom-shiba-tertiary mx-auto min-h-screen sm:min-h-[80vh] md:min-h-[60vh]">
            <h1 className="text-2xl font-bold text-center">{id ? `Edit ${entryType} Entry` : 'Add Entry'}</h1>
            <form onSubmit={handleSubmit} className="space-y-4 w-80">
                <div>
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                {!id && ( 
                    <div>
                        <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="entryType">Entry Type</label>
                        <select
                            id="entryType"
                            value={entryType}
                            onChange={(e) => {
                                setEntryType(e.target.value);
                                setCategory('');
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                            <option value="Liability">Liability</option>
                            <option value="Settlement">Settlement</option>
                        </select>
                    </div>
                )}
                <div>
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Select a category</option>
                        {categories[entryType]?.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
                >
                    {id ? 'Update Entry' : 'Add Entry'}
                </button>
                {id && (
                    <button
                        type="button"
                        onClick={handleDeleteEntry}
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-2xl hover:bg-red-700"
                    >
                        Delete Entry
                    </button>
                )}
            </form>
        </div>
    );
}

export default AddEntryPage;
