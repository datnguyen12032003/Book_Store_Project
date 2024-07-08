import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { getToken } from '../components/Login/app/static'; // Adjust the import path as necessary

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
                        'Authorization': `Bearer ${token}`
                    }
                });
                setBook(response.data);
                console.log(book.imageurls);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={book.imageurls[0]} alt={book.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                    <p className="text-gray-700 mb-2">{book.description}</p>
                    <div className="mb-2">
                        <p className="text-gray-900 font-medium">Author: <span className="text-gray-600">{book.author}</span></p>
                        <p className="text-gray-900 font-medium">Genre: <span className="text-gray-600">{book.genre}</span></p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-900 font-medium text-lg">${book.price}</p>
                        <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Buy Now</button>
                    </div>
                    <p className="text-gray-700">{book.pages} pages</p>
                    <p className="text-gray-700">Published by {book.publisher}</p>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
