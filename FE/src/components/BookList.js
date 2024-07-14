import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import { getToken } from '../components/Login/app/static'; // Adjust the import path as necessary

const BookList = ({ searchTerm }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const token = getToken();
                const response = await axios.get('/books', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBooks(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

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
    
    const filteredBooks = Array.isArray(books)
    ? books.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : [];
    
    const refreshPage = () => {
        window.location.reload();
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                    <div
                        key={book._id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl"
                    >
                        <Link to={`/book/${book._id}`}>
                            <img
                                src={
                                    book.imageurls.length > 0
                                        ? book.imageurls.find((image) => image.defaultImg)?.imageUrl ||
                                          book.imageurls[0].imageUrl
                                        : 'default-image-url.jpg'
                                }
                                alt={book.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{book.title}</h2>
                                <p className="text-gray-700 mb-2">{book.description}</p>
                                <div className="mb-2">
                                    <p className="text-gray-900 font-medium">
                                        Author: <span className="text-gray-600">{book.author}</span>
                                    </p>
                                    <p className="text-gray-900 font-medium">
                                        Genre: <span className="text-gray-600">{book.genre}</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-900 font-medium text-lg">{formatPrice(book.price)}đ</p>
                                    <button
                                        onClick={(e) => {
                                            refreshPage();
                                            e.preventDefault();
                                            addToCart(book);
                                        }}
                                        className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <div>Add To Cart</div>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;
