import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP and New Password
    const navigate = useNavigate();
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
            alert('OTP đã được gửi đến email của bạn');
            setStep(2);
        } catch (error) {
            console.error('Error sending email', error);
            toast.error('Email không tồn tại hoặc chưa được đăng ký !!!');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/resetpassword', {
                email,
                otp,
                newPassword,
            });
            alert('Mật khẩu đã được đặt lại thành công');
            navigate('/login');
            setStep(1);
            setEmail('');
            setOtp('');
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password', error);
            alert('Có lỗi xảy ra khi đặt lại mật khẩu');
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    {step === 1 ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                            >
                                Gửi OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center">Đặt lại mật khẩu</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">OTP:</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                            >
                                Đặt lại mật khẩu
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
