import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getGoogleToken, getToken } from './Login/app/static';

export default function Payment() {
    const location = useLocation();
    const { cart } = location.state;
    const [dataUser, setDataUser] = useState({});

    useEffect(() => {
        const token = getToken() || getGoogleToken();
        // Fetch user profile data when component mounts
        axios
            .get(
                'http://localhost:3000/api/users/profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
                {
                    withCredentials: true, // Ensure credentials are sent
                },
            )
            .then((response) => {
                setDataUser(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    // const formatPrice = (price) => {
    //     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="pb-5 font-medium text-lg">THANH TOÁN</h1>
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
                    {cart.map((item) => (
                        <div
                            key={item.book._id}
                            className="container grid grid-cols-12 gap-4 mt-6 p-4 h-30 shadow-2xl rounded-lg"
                        >
                            <div className="bookItem col-span-5 flex items-center justify-center">
                                <div className="bookImg w-1/2 mr-10">
                                    <img
                                        src={
                                            item.book.imageurls.length > 0
                                                ? item.book.imageurls[0].imageUrl
                                                : 'default-image-url.jpg'
                                        }
                                        alt={item.book.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="bookDesc w-3/4 break-all text-ellipsis overflow-hidden whitespace-nowrap">
                                    {item.book.title}
                                </div>
                            </div>
                            <div className="price col-span-2 flex items-center justify-center">
                                ${(item.price)}
                            </div>
                            <div className="amount col-span-2 flex items-center justify-center">{item.quantity}</div>
                            <div className="totalPrice col-span-2 flex items-center justify-center">
                                ${(item.total_price)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="rightCart w-1/4 pl-6">
                    <div className="shadow-2xl p-4 mb-5 h-30 rounded-lg">
                        <div className="total justify-between ">
                            <div className="provisionalInvoice text-lg pb-3">Thông tin người dùng</div>
                            <div className="upperInfo flex pb-3 grid grid-cols-12">
                                <div className="name pr-2 border-r-2 col-span-6">{dataUser.fullname}</div>
                                <div className="phone pl-2 col-span-6">{dataUser.phone}</div>
                            </div>
                            <div className="address">{dataUser.address}</div>
                        </div>
                    </div>
                    <button className="bg-red-500 w-full p-4 h-30 rounded-lg text-white">Thanh toán</button>
                </div>
            </div>
        </div>
    );
}
