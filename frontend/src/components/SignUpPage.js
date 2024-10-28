import React, { useState } from 'react';
import axios from 'axios';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name:'',
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
    })

    const [error, SetError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        SetError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
                user: formData,
            });
            setSuccessMessage('Registration successful!');
            setFormData({
                name:'',
                username:'',
                email:'',
                password:'',
                passwordConfirmation:'',
            });

        } catch (error){
            if (error.response){
                SetError(error.response.data.errors || 'Registration failed. Please try again.')
            } else {
                SetError('An error occurred. Please try again later.');
            }
        }
    }



    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold mb-4">Register</h2>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
                    <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="passwordConfirmation">Confirm Password</label>
                    <input
                        type="password"
                        name="passwordConfirmation"
                        id="passwordConfirmation"
                        value={formData.passwordConfirmation}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Register</button>
            </form>
        </div>
        );
};

export default SignUpPage;