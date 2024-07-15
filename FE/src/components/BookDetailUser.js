import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { getToken, getGoogleToken } from '../components/Login/app/static';
import { FaMinus, FaPlus, FaStar, FaUserCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = getToken() || getGoogleToken();
                const response = await axios.get(`/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBook(response.data);
                setSelectedImage(response.data.imageurls[0]);
                setQuantity(1);
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

        fetchBook();
        fetchUserData();
    }, [id]);

    const increaseQuantity = () => {
        if (quantity < book.quantity) {
            setQuantity(quantity + 1);
        } else {
            toast.error('Số lượng hàng không đủ');
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const addToCart = async () => {
        if (user && user.admin) {
            toast.error('Admin users cannot add items to the cart.');
            return;
        }

        try {
            const token = getToken() || getGoogleToken();
            await axios.post(
                '/cart',
                {
                    book: book._id,
                    price: book.price,
                    quantity: quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            toast.success('Đã thêm vào giỏ hàng');
        } catch (err) {
            console.error('Error adding item to cart:', err.message);
            toast.error('Đã xảy ra lỗi khi thêm vào giỏ hàng');
        }
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const postComment = async () => {
        try {
            const token = getToken() || getGoogleToken();
            await axios.post(
                `/books/${id}/comments`,
                {
                    comment: commentText,
                    rating: rating,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            toast.success('Bình luận của bạn đã được đăng thành công');
            // Refresh book data after posting comment
            const response = await axios.get(`/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBook(response.data);
            setCommentText('');
            setRating(0);
        } catch (err) {
            console.error('Error posting comment:', err.message);
            toast.error('Đã xảy ra lỗi khi đăng bình luận');
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
            <ToastContainer />
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex">
                <div className="w-2/5 p-4">
                    <div className="mb-4 flex justify-center items-center">
                        <img
                            src={selectedImage.imageUrl}
                            alt="Selected"
                            className="h-[400px] max-w-full max-h-screen object-contain rounded-lg shadow-md"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {book.imageurls.map((image, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={`Image ${index}`}
                                    className={`w-full h-24 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105 ${
                                        selectedImage === image ? 'border-2 border-blue-500' : ''
                                    }`}
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
                            <p className="text-gray-900 font-medium">
                                Author: <span className="text-gray-600">{book.author}</span>
                            </p>
                            <p className="text-gray-900 font-medium">
                                Genre: <span className="text-gray-600">{book.genre}</span>
                            </p>
                        </div>
                        <p className="text-gray-900 font-medium text-lg">{book.price} USD</p>
                        <p className="text-gray-700">Published by {book.publisher}</p>
                        <p className="text-gray-700">Số lượng hàng sẵn có: {book.quantity}</p>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center mb-4">
                            <button onClick={decreaseQuantity} className="mr-2 text-gray-500">
                                <FaMinus className="cursor-pointer" />
                            </button>
                            <span className="text-gray-900 font-medium">{quantity}</span>
                            <button onClick={increaseQuantity} className="ml-2 text-gray-500">
                                <FaPlus className="cursor-pointer" />
                            </button>
                        </div>
                        <button
                            onClick={addToCart}
                            className={`${
                                user && user.admin
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'bg-gradient-to-r from-yellow-100 to-orange-200 text-orange-500 hover:from-yellow-200 hover:to-orange-300 hover:text-white'
                            } text-white px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2`}
                            disabled={user && user.admin}
                        >
                            Add to shopping cart
                        </button>
                        <button
                            className={`${
                                user && user.admin
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                                    : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                            } text-white px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            disabled={user && user.admin}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Hiển thị các comment */}
            <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden p-8">
                {/* Form nhập bình luận */}

                <div className="mt-8">
                    <h4 className="text-xl font-semibold mb-4">Add a comment:</h4>
                    <div className="mb-4 flex items-center">
                        <span className="mr-2 text-l">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`text-gray-300 cursor-pointer ${
                                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                                onClick={() => handleRatingChange(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        className="w-full p-2 border rounded mb-4"
                        rows="4"
                        value={commentText}
                        onChange={handleCommentChange}
                    ></textarea>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={postComment}
                    >
                        Post Comment
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    {book.comments && book.comments.length > 0 ? (
                        book.comments.map((comment, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded mb-4">
                                <div className="flex items-center mb-2">
                                    <FaUserCircle className="mr-2 text-gray-400" />
                                    <h5 className="text-gray-900 font-semibold">{comment.username}</h5>
                                </div>
                                <div className="flex items-center mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`${
                                                star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-800">{comment.comment}</p>
                                <p className="text-gray-600 text-sm mt-2">
                                    {format(new Date(comment.date), 'dd/MM/yyyy')}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No comments yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
