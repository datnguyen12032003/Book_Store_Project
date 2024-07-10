// src/components/ImageUploader.js
import React, { useState } from 'react';
import axios from '../../axiosConfig'; // Đảm bảo đường dẫn đúng
import { getToken } from '../Login/app/static'; // Đảm bảo đường dẫn đúng

const ImageUploader = ({ bookId, onUploadSuccess }) => {
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    try {
      const updatedImages = await uploadMultipleImages(bookId, files);
      onUploadSuccess(updatedImages);
    } catch (error) {
      setError(error.message);
    }
  };

  const uploadSingleImage = async (bookId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
  
    try {
      const token = getToken();
      const response = await axios.post(`/upload/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  const uploadMultipleImages = async (bookId, imageFiles) => {
    if (!bookId) {
      throw new Error('Book ID is required');
    }
  
    const formData = new FormData();
    imageFiles.forEach((file) => formData.append('image', file));
  
    try {
      const token = getToken();
      const response = await axios.post(`/upload/many/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  

  return (
    <div className="mt-4">
      <input type="file" multiple onChange={handleImageUpload} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUploader;
