import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const navigate = useNavigate();

    const userName = localStorage.getItem('userName'); 
    const cash = localStorage.getItem('cash'); 
    const liabilities = localStorage.getItem('liabilities');

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="container mx-auto">
                {userName && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Hello, {userName}!</h2>
                        <div className="flex justify-between">
                            <p className="text-lg">Cash: ${cash}</p>
                            <p className="text-lg">Liabilities: ${liabilities}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button 
                    onClick={() => {
                        localStorage.removeItem('userName');
                        localStorage.removeItem('cash'); 
                        localStorage.removeItem('liabilities');
                        navigate('/'); 
                    }} 
                    className="px-4 py-2 mr-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                    Log-out
                </button>

                <button 
                    onClick={() => navigate('/add-entry')} 
                    className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Add Entry
                </button>
            </div>
        </div>
    );
}

export default UserPage;
