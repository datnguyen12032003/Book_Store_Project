import React, { useEffect, useState } from 'react';
import { getToken, getGoogleToken } from '../Login/app/static';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: '',
    });
    const navigate = useNavigate();
    const googleToken = getGoogleToken();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = getToken() || googleToken; // Lấy token từ localStorage hoặc cookie của Google
                const response = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError('Failed to fetch user profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleEditProfile = () => {
        setFormData({
            fullname: user.fullname,
            phone: user.phone,
            address: user.address,
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = async () => {
        try {
            const token = getToken() || googleToken; // Lấy token từ localStorage hoặc cookie của Google
            const response = await fetch('http://localhost:3000/api/users/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    phone: formData.phone,
                    address: formData.address,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Failed to update user profile. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    return (
        <div className="container mx-auto mt-8 h-[550px]">
            <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {isEditing ? (
                <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8 bg-blue-100">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Fullname:</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="text-lg text-gray-800 border border-gray-300 px-3 py-2 rounded-md w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            ) : user ? (
                <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-8 bg-blue-100">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Fullname:</label>
                            <p className="text-lg text-gray-800">{user.fullname}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Email:</label>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Username:</label>
                            <p className="text-lg text-gray-800">{user.username}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Address:</label>
                            <p className="text-lg text-gray-800">{user.address}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600">Phone:</label>
                            <p className="text-lg text-gray-800">{user.phone}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={handleEditProfile}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Update Profile
                            </button>

                            <Link
                                to="/"
                                className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Back to Homepage
                            </Link>

                            {!googleToken && (
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
