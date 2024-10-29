import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([
        { description: 'Grocery Shopping', type: 'expense', amount: 50 },
        { description: 'Salary', type: 'income', amount: 1500 },
        { description: 'Utility Bill', type: 'expense', amount: 100 },
        { description: 'Freelance Project', type: 'income', amount: 400 },
        { description: 'Dining Out', type: 'expense', amount: 30 },
        { description: 'Investment Return', type: 'income', amount: 200 },
        { description: 'Gasoline', type: 'expense', amount: 60 },
        { description: 'Bonus', type: 'income', amount: 300 },
        { description: 'New Shoes', type: 'expense', amount: 80 },
        { description: 'Gift', type: 'income', amount: 100 },
    ]);
    
    const userName = localStorage.getItem('userName'); 
    const cash = localStorage.getItem('cash'); 
    const liabilities = localStorage.getItem('liabilities');

    const totalIncome = entries.reduce((sum, entry) => sum + (entry.type === 'income' ? entry.amount : 0), 0);
    const totalExpense = entries.reduce((sum, entry) => sum + (entry.type === 'expense' ? entry.amount : 0), 0);

    const handleLogout = () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('cash'); 
        localStorage.removeItem('liabilities');
        navigate('/'); 
    };

    return (
        <div className="flex flex-col h-screen">
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
                            {entries.map((entry, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-6">{entry.description}</td>
                                    <td className="px-4 py-2">{entry.type}</td>
                                    <td className="px-4 py-2">{entry.type === 'expense' ? `$${entry.amount}` : '-'}</td>
                                    <td className="px-4 py-2">{entry.type === 'income' ? `$${entry.amount}` : '-'}</td>
                                </tr>
                            ))}
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
