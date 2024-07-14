import React, { useState } from 'react';
import axios from '../axiosConfig';
<<<<<<< HEAD
import { getToken } from '../components/Login/app/static'; // Adjust the import path as necessary
=======
import { getGoogleToken, getToken } from '../components/Login/app/static'; // Adjust the import path as necessary
>>>>>>> 9cc646103a4c7563619436b6491e6e995ac5a8fa
import { GoTrash } from 'react-icons/go';
import { FaPlus, FaMinus } from 'react-icons/fa';

export default function CartItem({ item }) {
    const [quantity, setQuantity] = useState(item.quantity);
    const [totalPrice, setTotalPrice] = useState(item.total_price);
<<<<<<< HEAD
// ne
    const updateQuantity = async (action) => {
        try {
            const token = getToken();
=======

    const updateQuantity = async (action) => {
        try {
            const token = getToken() || getGoogleToken();
>>>>>>> 9cc646103a4c7563619436b6491e6e995ac5a8fa
            let response;
            if (action === 'increase') {
                response = await axios.put(
                    `/cart/increase/${item._id}/product/${item.book._id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            } else {
                response = await axios.put(
                    `/cart/decrease/${item._id}/product/${item.book._id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
            }
            setQuantity(response.data.quantity);
            setTotalPrice(response.data.total_price);
        } catch (err) {
            console.error('Error updating quantity:', err.message);
        }
    };

    const removeFromCart = async () => {
        try {
            const token = getToken();
            await axios.delete(`/cart/${item._id}/product/${item.book._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh the cart or remove this item from the UI
        } catch (err) {
            console.error('Error removing from cart:', err.message);
        }
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // const increaseQuantity = () => {
    //     setQuantity((prevQuantity) => prevQuantity + 1);
    // };

    // const decreaseQuantity = () => {
    //     setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    // };

    return (
        <div className="container grid grid-cols-12 gap-4 mt-6 p-4 h-30 shadow-2xl rounded-lg">
            <div className="bookItem col-span-5 flex items-center justify-center">
                <div className="bookImg w-1/2 mr-10">
                    <img
                        src={item.book.imageurls.length > 0 ? item.book.imageurls[0].imageUrl : 'default-image-url.jpg'}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="bookDesc w-3/4 break-all text-ellipsis overflow-hidden whitespace-nowrap">
                    {item.book.title}
                </div>
            </div>
            <div className="price col-span-2 flex items-center justify-center">{formatPrice(item.price)}đ</div>
            <div className="amount col-span-2 flex items-center justify-center">
                <button onClick={() => updateQuantity('decrease')} className="mr-2 text-gray-500">
                    <FaMinus onClick={refreshPage} />
                </button>
                {quantity}
                <button onClick={() => updateQuantity('increase')} className="ml-2 text-gray-500">
                    <FaPlus onClick={refreshPage} />
                </button>
            </div>
            <div className="totalPrice col-span-2 flex items-center justify-center">{formatPrice(totalPrice)}đ</div>
            <div className="remove col-span-1 flex items-center justify-center" onClick={refreshPage}>
                <GoTrash className="text-red-500 cursor-pointer" onClick={removeFromCart} />
            </div>
        </div>
    );
}
