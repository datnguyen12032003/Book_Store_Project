import React, { useState, useEffect, useLayoutEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    getToken,
    setToken,
    setUserInfo,
    removeToken,
    removeTokenFromCookie,
    getGoogleToken,
} from './Login/app/static';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ onSearch }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dataUser, setDataUser] = useState({});

    useEffect(() => {
        const token = getToken() || getGoogleToken(); // Lấy token từ localStorage hoặc cookie của Google
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

    useLayoutEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        if (getToken() || getGoogleToken()) {
            const token = getToken() || getGoogleToken(); // Lấy token từ localStorage hoặc cookie của Google
            axios
                .get('http://localhost:3000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log('User Data:', response.data);
                    setUser(response.data);
                    setIsLoggedIn(true);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                    setIsLoggedIn(false);
                });
        } else {
            setIsLoggedIn(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        removeTokenFromCookie();
        navigate('/login', { replace: true });
        window.location.reload();
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
                    <li>
                        <Link to="/dashboard" className="hover:text-blue-300">
                            Dashboard
                        </Link>
                    </li>
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
                    {isLoggedIn || dataUser.email ? (
                        <>
                            <Link to="/profile" className="hover:text-blue-300">
                                Xin chào, {(user && user.username) || dataUser.email}
                            </Link>
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
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
