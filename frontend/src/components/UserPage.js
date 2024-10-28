import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserPage() {
    const navigate = useNavigate();

    return (
    <div>
        <h1>User Page</h1>
        <button onClick={() => navigate('/')}>Log-out</button>
        <button onClick={() => navigate('/add-entry')}>Add Entry</button>
    </div>
    );
}

export default UserPage;


