import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { getToken } from '../components/Login/app/static';
import { FaMinus, FaPlus } from 'react-icons/fa'; // Import FaMinus and FaPlus
const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // Default quantity to 1
    const [totalPrice, setTotalPrice] = useState(0); // Initialize total price

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = getToken();
                const response = await axios.get(`/books/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBook(response.data);
                setSelectedImage(response.data.imageurls[0]); // Set the first image as default
                setTotalPrice(response.data.price); // Set initial total price based on book price
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const addToCart = async () => {
        try {
            const token = getToken();
            const response = await axios.post(
                '/cart/add',
                {
                    bookId: book._id,
                    quantity: quantity,
                    totalPrice: totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // Handle success or navigate to cart
            console.log('Added to cart:', response.data);
        } catch (err) {
            console.error('Error adding to cart:', err.message);
        }
    };

    const updateQuantity = async (action) => {
        try {
            const token = getToken();
            let response;
            if (action === 'increase') {
                response = await axios.put(
                    `/cart/increase/${id}`,
                    { quantity: quantity + 1 },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setQuantity(quantity + 1);
            } else if (action === 'decrease' && quantity > 1) {
                response = await axios.put(
                    `/cart/decrease/${id}`,
                    { quantity: quantity - 1 },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setQuantity(quantity - 1);
            }
            // Update total price after quantity change
            setTotalPrice(response.data.totalPrice);
        } catch (err) {
            console.error('Error updating quantity:', err.message);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
                <div className="w-2/5 p-4">
                    <div className="mb-4 flex justify-center items-center">
                        <img
                            src={selectedImage ? selectedImage.imageUrl : ''}
                            alt="Selected"
                            className="h-[400px] max-w-full max-h-screen object-contain rounded-lg shadow-md"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {book.imageurls.map((image, index) => (
                            <div key={index} className="relative group cursor-pointer" onClick={() => setSelectedImage(image)}>
                                <img
                                    src={image.imageUrl}
                                    alt={`Image ${index}`}
                                    className={`w-full h-24 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105 ${selectedImage === image ? 'border-2 border-blue-500' : ''}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 p-4 mt-[50px] ml-[200px]">
                    <div className="mb-4">
                        <h2 className="text-3xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                        <p className="text-gray-700 mb-4">{book.description}</p>
                        <div className="mb-4">
                            <p className="text-gray-900 font-medium">Author: <span className="text-gray-600">{book.author}</span></p>
                            <p className="text-gray-900 font-medium">Genre: <span className="text-gray-600">{book.genre}</span></p>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">${book.price}</p>
                        <p className="text-gray-700">{book.pages} pages</p>
                        <p className="text-gray-700">Published by {book.publisher}</p>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center mb-4">
                            <button onClick={() => updateQuantity('decrease')} className="mr-2 text-gray-500">
                                <FaMinus className="cursor-pointer" />
                            </button>
                            <input
                                type="text"
                                className="w-12 text-center border-gray-300 rounded-md"
                                value={quantity}
                                readOnly
                            />
                            <button onClick={() => updateQuantity('increase')} className="ml-2 text-gray-500">
                                <FaPlus className="cursor-pointer" />
                            </button>
                        </div>
                        <button onClick={addToCart} className="bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-500 px-6 py-2 hover:from-yellow-200 hover:to-orange-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2">
                            Add to shopping cart
                        </button>
                        <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-2 hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
