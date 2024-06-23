import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <Router>
            <Navbar onSearch={handleSearch} />
            <Routes>
                <Route path="/" element={<BookList searchTerm={searchTerm} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
