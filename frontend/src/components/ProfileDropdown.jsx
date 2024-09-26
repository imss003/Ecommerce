import React, { useState } from 'react';
import DropdownComponent from './DropdownComponent';
import {motion} from "framer-motion";

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const variant = {
        whileOpen: { opacity: 0.5},
        initial: { opacity: 1},
    }
    return (
        <motion.div 
            className='relative'

        >
            <motion.div
                onClick={toggleDropdown} // Toggle dropdown visibility on click
                style={{
                    backgroundImage: "url('/avatar.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
                className='w-10 h-10 rounded-full cursor-pointer z-40 border-2 border-white'
                animate={isOpen ? "whileOpen" : "initial"}
                variants={variant}
            >
                {/* Profile Image or Button */}
            </motion.div>

            {/* Render DropdownComponent only when isOpen is true */}
            {isOpen && (
                <DropdownComponent toggleDropdown={toggleDropdown} />
            )}
        </motion.div>
    );
};

export default ProfileDropdown;
