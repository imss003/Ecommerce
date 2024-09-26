import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/profile/my-profile");
                setUser(response.data);
                setCart(response.data.cartItems || []); // Set cart items if available
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user data found.</div>;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <motion.div
                className='flex flex-col items-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Profile Picture */}
                <motion.div
                    className='w-24 h-24 rounded-full bg-gray-300 bg-cover bg-center'
                    style={{ backgroundImage: `url('../public/avatar.jpg')` }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                </motion.div>
                <motion.h1
                    className='mt-4 text-2xl font-semibold text-white'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {user.name}
                </motion.h1>
                <motion.p
                    className='text-gray-400'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    {user.email}
                </motion.p>
                <motion.div
                    className='mt-4'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className='text-white'>Cart Items: {cart.length}</p>
                    <div className='flex gap-4 mt-2'>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/cart"
                                className='bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Show Cart
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to="/update-profile"
                                className='bg-green-700 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out'
                            >
                                Update Profile
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;
