import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddEntryPage() {
    const navigate = useNavigate();

    return (
    <div>
        <h1>Add Entry</h1>
        <button onClick={() => navigate('/dashboard')}>Submit</button>
    </div>
    );
}

export default AddEntryPage;