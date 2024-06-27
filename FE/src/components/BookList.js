import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const BookList = ({ searchTerm }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/books');
                setBooks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-8 text-xl text-blue-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-xl text-red-600">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                    <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
                        <img src={book.imageUrl} alt={book.title} className="w-full h-64 object-cover" />
                        <div className="p-4">
                            <h2 className="text-2xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                            <p className="text-gray-700 mb-2">{book.description}</p>
                            <div className="mb-2">
                                <p className="text-gray-900 font-medium">Author: <span className="text-gray-600">{book.author}</span></p>
                                <p className="text-gray-900 font-medium">Genre: <span className="text-gray-600">{book.genre}</span></p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-gray-900 font-medium text-lg">${book.price}</p>
                                <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Buy Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;
