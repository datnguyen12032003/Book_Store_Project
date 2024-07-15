import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';
import { getToken, getGoogleToken } from '../components/Login/app/static';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookList = ({ searchTerm }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

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

        const fetchUserData = async () => {
            try {
                const token = getToken() || getGoogleToken();
                const response = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchBooks();
        fetchUserData();
    }, []);

    const addToCart = async (book) => {
        if (user && user.admin) {
            toast.error('Admin users cannot add items to the cart.');
            return;
        }
        if (book.quantity === 0) {
            toast.error('Hết hàng');
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
            toast.success('Đã thêm vào giỏ hàng');
        } catch (err) {
            console.error('Error adding to cart:', err.message);
            toast.error('Error: Đã xảy ra lỗi khi thêm vào giỏ hàng');
        }
    };

    const filteredBooks = Array.isArray(books)
        ? books.filter(
              (book) =>
                  book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  book.author.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : [];

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
            <ToastContainer />
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
                                    <p className="text-gray-900 font-medium text-lg">
                                        {formatPrice(book.price)}.00 USD
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(book);
                                        }}
                                        disabled={user && user.admin}
                                        className={`${
                                            user && user.admin
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                                        } text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                        Add To Cart
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
