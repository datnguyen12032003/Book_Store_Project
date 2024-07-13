import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AddBook from './components/Admin/AddBook';
import BookListAdmin from './components/Admin/BookListAdmin';
import AdminDashboard from './components/Admin/AdminDashboard';
import Revenue from './components/Admin/Revenue';
import BookDetail from './components/Admin/BookDetail';
import EditBook from './components/Admin/EditBook';
import UploadMultipleImages from './components/Admin/UploadMultipleImages';

import Login from './components/Login/Login';
import SignUp from './components/Login/Sinup';
import ResetPassword from './components/Login/ForgotPassword';
import ProfilePage from './components/Users/profile';
import BookDetailUser from './components/BookDetailUser';
import ChangePassword from './components/Users/ChangePassword';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Router>
            <Navbar onSearch={handleSearch} />
            <Routes>
                {/* Thang */}
                <Route path="/" element={<BookList searchTerm={searchTerm} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route exact path="/booklistadmin" element={<BookListAdmin />} />
                <Route path="/addbook" element={<AddBook />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/edit/:id" element={<EditBook />} />
                <Route path="/books/:id/upload/many" element={<UploadMultipleImages />} />
                <Route path="/book/:id" element={<BookDetailUser />} />
                {/* Viet */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/change-password" element={<ChangePassword />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
