import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios'; // Adjust the import path based on your setup
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const UpdateProfilePage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/profile/my-profile', { name, email, password });
            toast.success('Profile updated successfully!');
            navigate('/profile'); // Redirect to the profile page after update
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/profile/my-profile");
                setName(response.data.name);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-900 p-6'>
            <motion.div
                className='w-full max-w-md bg-gray-800 text-white rounded-lg shadow-lg p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className='text-3xl font-semibold mb-6 text-center'>Update Profile</h1>
                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium mb-2' htmlFor='name'>Full Name</label>
                        <input
                            id='name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Enter your full name'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
                        <input
                            id='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Enter your email address'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2' htmlFor='password'>New Password</label>
                        <input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Enter a new password'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2' htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            id='confirmPassword'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='Confirm your new password'
                        />
                    </div>
                    {error && <p className='text-red-400 text-sm'>{error}</p>}
                    <button
                        type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition duration-300 ease-in-out'
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateProfilePage;
