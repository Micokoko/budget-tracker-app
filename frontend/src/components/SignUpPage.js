import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        cash: 0,
        liabilities: 0
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

    
        try {
            const response = await signupUser({
                user: {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    cash: Number(formData.cash),
                    liabilities: Number(formData.liabilities),
                },
            });
            setSuccessMessage('Registration successful!');
            setFormData({
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
                cash: 0,
                liabilities: 0
            });
            alert("User has been successfully created!")
            navigate('/');
            setLoading(false);
        } catch (error) {
            console.error('Error during signup:', error); 
    

            if (typeof error === 'string') {
                setError(error); 
            } else if (error && typeof error === 'object') {
                setLoading(false);
                setError(Object.values(error).flat().join(', ')); 
            } else {
                setError('Registration failed. Please try again.');
                setLoading(false);
            }
        }
    };
    
    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-custom-shiba-secondary rounded-lg shadow-lg border-4 border-custom-shiba-tertiary">
            {error && (
                <div className="text-red-500 mb-2">
                    {typeof error === 'string' ? error : Object.values(error).map((msg, index) => (
                        <div key={index}>{msg}</div>
                    ))}
                </div>
            )}
            {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        placeholder="username"
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        placeholder="email address"
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        placeholder="password"
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block pl-2 text-xs font-semibold text-gray-700" htmlFor="passwordConfirmation">Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        id="passwordConfirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="confirm password"
                        className="mt-1 block w-full border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        required
                    />
                </div>
                <input type="hidden" name="cash" value={formData.cash} />
                <input type="hidden" name="liabilities" value={formData.liabilities} />

                <button type="submit" 
                        className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white border-solid rounded-full" viewBox="0 0 24 24"></svg>
                        ) : "Register"}
                </button>
                
            </form>
        </div>

    );
};

export default SignUpPage;
