import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        const data = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch("http://127.0.0.1:3000/users/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                localStorage.setItem('userName', result.user.name);
                localStorage.setItem('cash', result.user.cash); 
                localStorage.setItem('liabilities', result.user.liabilities);


                navigate("/dashboard"); 
            } else {
                const errorData = await response.json();
                setError(errorData.errors.join(", ")); 
            }
        } catch (error) {
            setError("An error occurred while logging in."); 
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Login
                </button>
            </form>
            {error && <p className="text-red-600">{error}</p>} 
            <div className="flex justify-between">
                <button 
                    onClick={() => navigate('/signup')} 
                    className="text-sm text-blue-600 hover:underline"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default LoginPage;
