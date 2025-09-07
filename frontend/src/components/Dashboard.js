// frontend/src/components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    if (!user) {
        return <p>Loading...</p>; // Or a spinner component
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-xl text-gray-700">
                    Welcome, <span className="font-semibold text-indigo-600">{user.email}</span>!
                </p>
                <p className="text-gray-500">You have successfully logged in. This is your protected dashboard.</p>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 mt-4 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;