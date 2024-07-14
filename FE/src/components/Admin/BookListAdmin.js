import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axiosConfig';
import BookDetail from './BookDetail';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const BookListAdmin = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = getToken();
      const response = await axios.get('/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book List</h2>
      <ul className="divide-y divide-gray-200">
        {books.map((book) => (
          <li key={book._id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p className="text-gray-600">Price: ${book.price}</p>
                <p className="text-gray-600">Quantity: {book.quantity}</p>
              </div>
              <div className="ml-4">
                <Link to={`/books/${book._id}`} className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-full hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Description</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookListAdmin;
