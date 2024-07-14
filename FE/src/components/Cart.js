import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { getGoogleToken, getToken } from '../components/Login/app/static'; // Adjust the import path as necessary
import CartItem from './CartItem'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = getToken() || getGoogleToken();
                const response = await axios.get('/cart', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCart(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleChangePayment = () => {
        navigate('/payment', { state: { cart } });
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.total_price, 0);
    };

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="pb-5 font-medium text-lg">GIỎ HÀNG</h1>
            <div className="flex">
                <div className="leftCart w-3/4 pr-6">
                    <div className="cartTitle">
                        <div className="container grid grid-cols-12 gap-4 p-4 h-30 shadow-2xl rounded-lg">
                            <div className="bookItem col-span-5 flex">Sản phẩm</div>
                            <div className="price col-span-2 flex items-center justify-center">Đơn giá</div>
                            <div className="amount col-span-2 flex items-center justify-center">Số lượng</div>
                            <div className="totalPrice col-span-2 flex items-center justify-center">Thành tiền</div>
                            <div className="remove col-span-1 flex items-center justify-center"></div>
                        </div>
                    </div>
                    {cart.length === 0 ? (
                        <div className="pt-10 text-center text-xl text-gray-700">Giỏ hàng trống</div>
                    ) : (
                        cart.map((item) => <CartItem key={item._id} item={item} />)
                    )}
                </div>
                <div className="rightCart w-1/4 pl-6">
                    <div className="shadow-2xl p-4 mb-5 h-30 rounded-lg">
                        <div className="total flex justify-between">
                            <div className="provisionalInvoice">Tổng tiền</div>
                            <div className="font-medium text-red-600 text-lg">
                                {formatPrice(calculateTotalPrice())}đ
                            </div>
                        </div>
                    </div>
                    <button onClick={handleChangePayment} className="bg-red-500 w-full p-4 h-30 rounded-lg text-white">Mua hàng</button>
                </div>
            </div>
        </div>
    );
}
