import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken, removeTokenFromCookie, getGoogleToken } from './Login/app/static';
import { jwtDecode } from 'jwt-decode';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const Navbar = ({ onSearch }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dataUser, setDataUser] = useState({});
    const [totalBook, setTotalBook] = useState([]);

    useEffect(() => {
        const token = getToken() || getGoogleToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setDataUser(decoded);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Invalid token:', error.message);
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserData();
        }
    }, [isLoggedIn]);

    const fetchUserData = () => {
        const token = getToken() || getGoogleToken();
        axios
            .get('http://localhost:3000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                setIsLoggedIn(false);
            });
    };

    useEffect(() => {
        const token = getToken() || getGoogleToken();
        // Fetch user profile data when component mounts
        axios
            .get(
                'http://localhost:3000/api/cart',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    withCredentials: true, // Ensure credentials are sent
                },
            )
            .then((response) => {
                setTotalBook(response.data);
                console.log(totalBook.length)
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);


    const handleLogout = () => {
        removeToken();
        removeTokenFromCookie();
        navigate('/login', { replace: true });
        window.location.reload();
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleHistoryClick = () => {
        navigate('/history');
    };

    return (
        <nav className="bg-orange-500 text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="text-3xl font-semibold tracking-tight hover:text-white">
                        FB88.com
                    </Link>
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="px-4 py-2 text-black rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <ul className="flex space-x-6 text-lg">
                    {isLoggedIn && (dataUser.admin || user?.admin) ? (
                        <>
                            <li>
                                <Link to="/dashboard" className="hover:text-blue-300">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="relative group">
                                <button className="hover:text-blue-300 focus:outline-none">
                                    Xin chào, {(user && user.username) || dataUser.email}
                                </button>
                                <ul className="absolute hidden group-hover:block right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                    <li>
                                        <Link
                                            to="/profile"
                                            onClick={handleProfileClick}
                                            className="block px-4 py-2 text-gray-800 hover:bg-blue-300"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/history"
                                            onClick={handleHistoryClick}
                                            className="block px-4 py-2 text-gray-800 hover:bg-blue-300"
                                        >
                                            History Payment
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="hover:text-blue-300">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/" className="hover:text-blue-300">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-blue-300">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-blue-300">
                                    Contact
                                </Link>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li className="relative group">
                                        <button className="hover:text-blue-300 focus:outline-none">
                                            Xin chào, {(user && user.username) || dataUser.email}
                                        </button>
                                        <ul className="absolute hidden group-hover:block right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1">
                                            <li>
                                                <Link
                                                    to="/profile"
                                                    onClick={handleProfileClick}
                                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-300"
                                                >
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/history"
                                                    onClick={handleHistoryClick}
                                                    className="block px-4 py-2 text-gray-800 hover:bg-blue-300"
                                                >
                                                    History Payment
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/cart" className="hover:text-blue-300 relative flex items-center">
                                            <AiOutlineShoppingCart className="w-6 h-6" />
                                            <span className="bookQuantity absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                                {totalBook.length}
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="hover:text-blue-300">
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/login" className="hover:text-blue-300">
                                        Login
                                    </Link>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
