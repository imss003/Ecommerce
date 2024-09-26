import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { motion } from "framer-motion";

const DropdownComponent = ({ toggleDropdown }) => {
    const { logout } = useUserStore();

    const handleLogout = () => {
        logout();
        toggleDropdown();
    };

    return (
        <motion.div
            className='absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg z-50'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <ul className='py-2'>
                <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Link
                        to="/profile"
                        className='block px-4 py-2 hover:bg-gray-600 transition-colors'
                        onClick={toggleDropdown}
                    >
                        View Profile
                    </Link>
                </motion.li>
                <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Link
                        to="/update-profile"
                        className='block px-4 py-2 hover:bg-gray-600 transition-colors'
                        onClick={toggleDropdown}
                    >
                        Update Profile
                    </Link>
                </motion.li>
                <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <button
                        className='w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors'
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </motion.li>
            </ul>
        </motion.div>
    );
};

export default DropdownComponent;
