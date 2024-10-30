import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext'; 
import { deleteEntryById, getEntryById } from '../services/api';

function AddEntryPage() {
    const navigate = useNavigate();
    const { username, addEntry } = useContext(UserContext);
    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const [id, setId] = useState(query.get('id') || '');
    const [date, setDate] = useState('');
    const [entryType, setEntryType] = useState('Income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');


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

    const handleAddOrEditEntry = async (event) => {
        event.preventDefault();

        if (!username) {
            setError('Username is required');
            return;
        }

        const payload = {
            date,
            entry_type: entryType,
            description,
            amount: parseFloat(amount),
        };

        const url = id ? `http://localhost:3000/entries/${id}?username=${username}` : `http://localhost:3000/entries?username=${username}`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const updatedEntry = await response.json();
            addEntry(updatedEntry);
            navigate('/dashboard');
        } else {
            setError('Failed to add or update entry');
            console.error('Failed to add or update entry');
        }
    };

    const handleDeleteEntry = async () => {
        if (id) {
            if (!username) {
                setError('Username is required');
                return;
            }
            
            try {
                await deleteEntryById(id, username); 
                navigate('/dashboard'); 
            } catch (err) {
                setError('Failed to delete entry');
            }
        }
    };
    

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">{id ? 'Edit Entry' : 'Add Entry'}</h1>
                <form onSubmit={handleAddOrEditEntry} className="space-y-4">
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
                        </select>
                    </div>
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
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {id ? 'Update Entry' : 'Add Entry'}
                    </button>
                </form>
                {error && <p className="text-red-600 text-center">{error}</p>}
                {id && (
                    <button
                        onClick={handleDeleteEntry}
                        className="w-full mt-4 px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                        Delete Entry
                    </button>
                )}
            </div>
        </div>
    );
}

export default AddEntryPage;
