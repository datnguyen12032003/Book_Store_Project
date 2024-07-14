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
        <div className="container mx-auto px-4 py-8">
            <h1 className="pb-5 font-medium text-lg">THANH TOÁN THẤT BẠI</h1>
            <p>Vui lòng thanh toán lại</p>
        </div>
    );
}
