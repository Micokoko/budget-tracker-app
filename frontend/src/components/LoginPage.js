import React from "react";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    
    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
            <button onClick={() => navigate('/dashboard')}>Login</button>
        </div>
    );
    }

export default LoginPage