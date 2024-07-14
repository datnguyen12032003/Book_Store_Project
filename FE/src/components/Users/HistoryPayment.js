import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getToken, getGoogleToken } from '../Login/app/static';

const HistoryPayment = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

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

        minutes = minutes < 10 ? '0' + minutes : minutes;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedDateTime = `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
        return formattedDateTime;
    };

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="ml-5 mb-5">
            <div className="flex-between-center mb-5">
                <h3 className="text-primary text-center text-3xl font-bold mt-5">Payment history</h3>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-center text-red-500 text-xl mt-5">No order history found.</p>
            ) : (
                <div>
                    <table className="w-full">
                        <thead className="border-b-[1px]">
                            <tr className="text-left text-[#6a697c]">
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Order ID</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Date</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Price</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Address</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Phone</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Status</th>
                                <th className="font-semibold py-4 text-green-700 border-gray-200 text-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-4 border-gray-200">{order._id}</td>
                                    <td className="py-4 border-gray-200">{order.formattedDate}</td>
                                    <td className="py-4 border-gray-200">{order.total_price}</td>
                                    <td className="py-4 border-gray-200">{order.address}</td>
                                    <td className="py-4 border-gray-200">{order.phone}</td>
                                    <td className="py-4 border-gray-200">{order.order_status}</td>
                                    <td className="py-4 border-gray-200">
                                        <button
                                            className="text-blue-500 hover:underline"
                                            onClick={() => handleViewDetail(order)}
                                        >
                                            View Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Modal
                        isOpen={selectedOrder !== null}
                        onRequestClose={closeModal}
                        contentLabel="Order Details"
                        className="fixed inset-0 flex items-center justify-center p-4 bg-white rounded shadow-lg max-w-3xl mx-auto my-44"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                    >
                        {selectedOrder && (
                            <div className="w-full max-h-[80vh] overflow-y-auto p-4">
                                <h3 className="text-xl font-semibold text-center text-lg">Order Items</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                    {selectedOrder.order_details.map((detail, idx) => (
                                        <div key={idx} className="border p-4 rounded shadow-sm">
                                            <p>
                                                <strong>Title:</strong> {detail.book.title}
                                            </p>
                                            <p>
                                                <strong>Author:</strong> {detail.book.author}
                                            </p>
                                            <p>
                                                <strong>Price:</strong> {detail.book.price}
                                            </p>
                                            <p>
                                                <strong>Quantity:</strong> {detail.order_quantity}
                                            </p>
                                            <p>
                                                <strong>Total:</strong> {detail.order_price}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default HistoryPayment;
