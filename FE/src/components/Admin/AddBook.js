import React, { useState } from 'react';
import axios from '../../axiosConfig';
import { getToken } from '../Login/app/static'; // Adjust the import path as necessary

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post('/books', {
        title,
        author,
        publisher,
        genre,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Book added:', response.data);
      setShowModal(true);
      // Reset form fields here if needed
      setTitle('');
      setAuthor('');
      setPublisher('');
      setGenre('');
      setPrice('');
      setQuantity('');
      setDescription('');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.'); // Show an alert for error handling
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Redirect to dashboard after closing modal
    window.location.href = '/dashboard';
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Publisher:</label>
          <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Genre:</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
        </div>

        <div className="text-right">
          <button type="submit" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:from-orange-500 hover:to-orange-700">Add Book</button>
        </div>
      </form>

      {/* Modal thành công */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-25"></div>
          <div className="bg-white p-8 rounded-lg shadow-md z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Book Added Successfully!</h2>
            <button onClick={closeModal} className="px-4 py-2 bg-orange-500 text-white rounded-lg focus:outline-none hover:bg-orange-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBook;
