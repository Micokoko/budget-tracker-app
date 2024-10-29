import React, { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { UserContext } from '../UserContext'; 

function LoginPage() {
    const navigate = useNavigate();
    const { setUsername } = useContext(UserContext); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const credentials = {
            email,
            password,
        };

        try {
            const result = await loginUser(credentials); 
            console.log(result);


            setUsername(result.user.username); 

            localStorage.setItem('userName', result.user.name);
            localStorage.setItem('cash', result.user.cash);
            localStorage.setItem('liabilities', result.user.liabilities);

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center">BUDGET INU</h1>
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
