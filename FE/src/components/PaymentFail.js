import React, { useEffect } from 'react';
import { getGoogleToken, getToken } from './Login/app/static';
import axios from 'axios';

export default function PaymentFail() {
    useEffect(() => {
        const token = getToken() || getGoogleToken();
        // Fetch user profile data when component mounts
        axios
            .get(
                'http://localhost:3000/api/payment/cancel',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    withCredentials: true, // Ensure credentials are sent
                },
            )
            .then((response) => {})
            .catch((error) => {
                console.error('Error fetching fail status:', error);
            });
    }, []);

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 flex justify-center items-center">
            <div className="max-w-md text-2xl font-semibold shadow-md p-8 rounded-lg text-gray-800 mb-4">
                <div className=' text-2xl mb-4'>Checkout Fail</div>
                <div className="flex items-center justify-center mb-6">
                    <img className='w-14 h-14 mr-4' src="https://th.bing.com/th/id/OIP.phTFtqlOwNeT0uZBDgP54QHaHa?w=880&h=880&rs=1&pid=ImgDetMain" alt="" />
                    <p className=' text-2xl'>Please checkout again!</p>
                </div>
            </div>
        </div>
    );
}
