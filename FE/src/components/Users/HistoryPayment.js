import React, { useState, useEffect } from 'react';
import { getToken, getGoogleToken } from '../Login/app/static';

const HistoryPayment = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const token = getToken() || getGoogleToken();
                const response = await fetch('http://localhost:3000/api/orders/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order history');
                }
                const ordersData = await response.json();
                // Chuyển đổi định dạng ngày tháng
                const formattedOrders = ordersData.map((order) => ({
                    ...order,
                    formattedDate: formatDate(order.order_date),
                }));
                setOrders(formattedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order history:', error);
                setError('Failed to fetch order history. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    const formatDate = (dateTimeString) => {
        const dateObj = new Date(dateTimeString);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        let hours = dateObj.getHours();
        let minutes = dateObj.getMinutes();

        // Format minutes to always display two digits
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // Determine if it's AM or PM
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours from 24-hour to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        // Combine everything into the desired format
        const formattedDateTime = `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
        return formattedDateTime;
    };

    return (
        <div className="ml-5 mb-5">
            <div className="flex-between-center mb-5">
                <h3 className="text-primary text-center text-3xl font-bold mt-5">Payment history</h3>
            </div>
            <div>
                <table className="w-full">
                    <thead className="border-b-[1px] ">
                        <tr className="text-left  text-[#6a697c] ">
                            <th className="font-semibold  py-4 text-green-700 border-gray-200 text-lg">Order ID</th>
                            <th className="font-semibold  py-4 text-green-700 border-gray-200  text-lg">Date</th>
                            <th className="font-semibold  py-4 text-green-700 border-gray-200  text-lg">Price</th>
                            <th className="font-semibold  py-4 text-green-700  border-gray-200  text-lg">Address</th>
                            <th className="font-semibold  py-4 text-green-700  border-gray-200  text-lg">Phone</th>
                            <th className="font-semibold  py-4 text-green-700  border-gray-200  text-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-4  border-gray-200">{order._id}</td>
                                <td className="py-4  border-gray-200">{order.formattedDate}</td>
                                <td className="py-4  border-gray-200">{order.total_price}</td>
                                <td className="py-4  border-gray-200 ">{order.address}</td>
                                <td className="py-4  border-gray-200 ">{order.phone}</td>
                                <td className="py-4  border-gray-200 ">{order.order_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPayment;
