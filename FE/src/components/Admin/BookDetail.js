// src/components/BookDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../axiosConfig'; // Đảm bảo đường dẫn đúng
import ImageUploader from './ImageUploader'; // Đảm bảo đường dẫn đúng
import { getToken } from '../Login/app/static'; // Đảm bảo đường dẫn đúng

const BookDetail = ({ books }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    if (books && books.length > 0) {
      const selectedBook = books.find((book) => book._id === id);
      if (selectedBook) {
        setBook(selectedBook);
      } else {
        fetchBookDetail();
      }
    } else {
      fetchBookDetail();
    }
  }, [id, books]);

  const handleUploadSuccess = (updatedImages) => {
    setBook((prevBook) => ({
      ...prevBook,
      imageurls: updatedImages,
    }));
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <h2 className="text-2xl font-bold mb-4 text-black">{book.title}</h2>
        <div className="ml-6 mt-[3px]">
          <Link
            to={`/edit/${book._id}`}
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:from-orange-500 hover:to-orange-700"
          >
            Edit Book
          </Link>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            <tr className="bg-orange-100">
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attribute
              </td>
              <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Author
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.author}
              </td>
            </tr>
            <tr className="bg-orange-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Publisher
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.publisher}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Genre
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.genre}
              </td>
            </tr>
            <tr className="bg-orange-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Price
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${book.price}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Quantity
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.quantity}
              </td>
            </tr>
            <tr className="bg-orange-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Description
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {book.description}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ImageUploader bookId={book._id} onUploadSuccess={handleUploadSuccess} />
      {book.imageurls && book.imageurls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {book.imageurls.map((image) => (
              <div key={image._id}>
                <img src={`http://localhost:3000/${image.imageUrl}`} alt="Book" className="w-full h-auto rounded" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
