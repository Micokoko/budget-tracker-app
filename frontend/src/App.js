import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import UserPage from './components/UserPage';
import AddEntryPage from './components/AddEntryPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<UserPage />} />
        <Route path="/add-entry" element={<AddEntryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
