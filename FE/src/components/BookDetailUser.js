import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { getToken } from '../components/Login/app/static';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBook(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const addToCart = async (book) => {
        if (book.quantity === 0) {
            alert('Hết hàng');
            return;
        }
        try {
            const token = getToken();
            const response = await axios.post(
                '/cart',
                {
                    book: book._id,
                    price: book.price,
                    quantity: 1, // or any desired initial quantity
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            console.log('Added to cart:', response.data);
            alert('Đã thêm vào giỏ hàng');
        } catch (err) {
            console.error('Error adding to cart:', err.message);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 gap-4">
                    {book.imageurls.map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Image ${index}`}
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
                <div className="p-4">
                    <h2 className="text-3xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                    <p className="text-gray-700 mb-4">{book.description}</p>
                    <div className="mb-4">
                        <p className="text-gray-900 font-medium">
                            Author: <span className="text-gray-600">{book.author}</span>
                        </p>
                        <p className="text-gray-900 font-medium">
                            Genre: <span className="text-gray-600">{book.genre}</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-900 font-medium text-lg">{formatPrice(book.price)}đ</p>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(book);
                            }}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 rounded-full hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                    <p className="text-gray-700">{book.pages} pages</p>
                    <p className="text-gray-700">Published by {book.publisher}</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
