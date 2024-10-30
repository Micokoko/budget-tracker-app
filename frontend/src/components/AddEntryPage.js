import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext'; 

function AddEntryPage() {
    const navigate = useNavigate();
    const { username, addEntry } = useContext(UserContext); // Destructure addEntry from context

    const [date, setDate] = useState('');
    const [entryType, setEntryType] = useState('Income'); 
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleAddEntry = async (event) => {
        event.preventDefault();
    
        if (!username) {
            setError('Username is required');
            return;
        }
    
        const response = await fetch(`http://localhost:3000/entries?username=${username}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                entry_type: entryType,
                description,
                amount: parseFloat(amount),
            }),
        });
    
        if (response.ok) {
            const newEntry = await response.json();
            addEntry(newEntry); 
            navigate('/dashboard');
        } else {
            setError('Failed to add entry');
            console.error('Failed to add entry');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Add Entry</h1>
                <form onSubmit={handleAddEntry} className="space-y-4">
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
                        Add Entry
                    </button>
                </form>
                {error && <p className="text-red-600 text-center">{error}</p>}
            </div>
        </div>
    );
}

export default AddEntryPage;
