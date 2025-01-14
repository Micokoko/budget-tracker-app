import React, { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { UserContext } from '../UserContext'; 

function LoginPage() {
    
    const { setUsername } = useContext(UserContext); 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();

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

            localStorage.setItem('username', result.user.username);
            localStorage.setItem('cash', result.user.cash);
            localStorage.setItem('liabilities', result.user.liabilities);

            navigate("/dashboard");
        } catch (error) {
            console.error('Error during login:', error);

            if (typeof error === 'string') {
                setError(error); 
            } else if (error && typeof error === 'object') {
                setError(Object.values(error).flat().join(', ')); 
            } else {
                setError('Login failed. Please try again.'); 
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-custom-shiba-main overflow-y-auto">
            <div className="w-full max-w-md p-8 space-y-8 bg-custom-shiba-secondary rounded-lg shadow-lg border-4 border-custom-shiba-tertiary">
                <h1 className="text-5xl md:text-7xl font-bold text-center font-logoFont">BUDGET INU</h1>
                <div className="bg-custom-shiba-secondary py-3">
                    <img className="object-scale-down h-36 w-full" src='images/budget-inu-logo.png' alt="Budget Inu Logo" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block pl-2 text-xs font-semibold text-slate-950" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="you@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block pl-2 text-xs font-semibold text-slate-950" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>

                <div className="flex justify-center items-center">
                    <p className="text-center text-slate-950">
                        No account yet?{" "}
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-m font-extrabold text-blue-600 hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>


    );
}

export default LoginPage;
