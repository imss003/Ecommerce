import React from 'react';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
    const {user, logout} = useUserStore();
    const {cart} = useCartStore();
    const isAdmin = (user?.role === 'admin');
    return (
        <header 
            className='fixed top-0 left-0 w-full bg-black bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-white'
        >
                <div 
                    className='container mx-auto px-4 py-3'
                >
                    <div 
                        className='flex flex-wrap justify-between items-center'
                    >
                        <Link 
                            to='/' 
                            className='text-2xl font-bold text-white items-center space-x-2 flex'
                        >
                            ShopNOW
                        </Link>

                        <nav
                            className='flex flex-wrap items-center gap-4'
                        >
                            <Link
                                to={'/'}
                                className='flex items-center justify-center text-white  hover:border-gray-400 hover:rounded-md hover:border-2 h-8 w-16 transition  duration-300 ease-in-out'
                            >
                                Home
                            </Link>
                            {
                                user && (
                                    <Link
                                        to={"/cart"}
                                        className='relative group text-blue-300 hover:text-blue-400 transition  duration-300 ease-in-out'
                                    >
                                        <ShoppingCart       
                                            className='inline-block mr-1 group-hover:text-blue-400' 
                                            size={20} 
                                        />
                                        <span 
                                            className='hidden sm:inline'
                                        >
                                            Cart
                                        </span>
                                        <span
                                            className='absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-0.4 text-xs group-hover:bg-blue-400 transition duration-300 ease-in-out'
                                        >
										    {cart.length}
									    </span>
                                    </Link>
                                )
                            }
                            {
                                isAdmin && (
                                    <Link
                                        className='bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center h-10'
                                        to={'/secret-dashboard'}
                                    >
                                        <Lock className='inline-block mr-1' size={18} />
                                        <span className='hidden sm:inline'>Dashboard</span>
                                    </Link>
                                )
                            }
                            {
                                user ? (
                                    // <button
                                    //     className='bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                    //     onClick={logout}
                                    // >
                                    //     <LogOut 
                                    //         size={18} 
                                    //     />
                                    //     <span 
                                    //         className='hidden sm:inline ml-2'
                                    //     >
                                    //         Log Out
                                    //     </span>
                                    // </button>
                                    <ProfileDropdown/>
                                ) : (
                                    <>
                                        <Link
                                            to={"/signup"}
                                            className='bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                        >
                                            <UserPlus 
                                                className='mr-2' 
                                                size={18} 
                                            />
                                            SignUp
                                        </Link>
                                        <Link
                                            to={"/login"}
                                            className='bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                        >
                                            <LogIn 
                                                className='mr-2' 
                                                size={18} 
                                            />
                                            Login
                                        </Link>
                                    </>
                                )
                            }
                        </nav>
                    </div>
                </div>
        </header>
    )
}

export default Navbar