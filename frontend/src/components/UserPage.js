import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName'); 

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">User Page</h1>
            {userName ? (
                <h2 className="text-xl">Hello, {userName}!</h2>
            ) : (
                <h2 className="text-xl">Hello, Guest!</h2>
            )}
            <div className="mt-4">
                <button 
                    onClick={() => {
                        localStorage.removeItem('userName');
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
