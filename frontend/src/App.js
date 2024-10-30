// src/App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserPage from './components/UserPage';
import AddEntryPage from './components/AddEntryPage';

import { UserProvider } from './UserContext'; 

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <div className="w-screen h-screen items-center justify-center flex flex-col border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/dashboard" element={<UserPage />} />
              <Route path="/add-entry" element={<AddEntryPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
