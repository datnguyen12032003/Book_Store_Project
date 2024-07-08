import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onSearch }) => {
  return (
    <nav className="bg-orange-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-tight hover:text-white"
          >
            FB88.com
          </Link>
          <input
            type="text"
            placeholder="Search books..."
            className="px-4 py-2 text-black rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <ul className="flex space-x-6 text-lg">
        <li>
            <Link to="/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-blue-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-300">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-blue-300">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
