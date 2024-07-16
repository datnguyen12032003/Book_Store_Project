import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from './Login/app/static';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const deleteCart = async () => {
            try {
                const token = getToken(); // Assuming you have a function to get the token
                let response = await axios.delete('http://localhost:3000/api/cart/deleteCart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error('Error deleting cart:', error);
            }
        };

        deleteCart();
    }, []);

    const goHome = () => {
        navigate('/');
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 flex justify-center items-center">
            <div className="max-w-md text-2xl font-semibold shadow-md p-8 rounded-lg text-gray-800 mb-4">
                <div className=' text-2xl mb-4'>Checkout Successful</div>
                <div className="flex items-center justify-center mb-6">
                    <img className='w-14 h-14 mr-4' src="https://static.vecteezy.com/system/resources/previews/010/152/436/original/tick-check-mark-icon-sign-symbol-design-free-png.png" alt="" />
                    <p className=' text-2xl'>Thanks for using BestBook!</p>
                </div>
                <button onClick={goHome} className=' text-blue-500'>Quay về trang chủ</button>
            </div>
        </div>
    );
}

