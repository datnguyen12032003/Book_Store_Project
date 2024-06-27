import React, { useState, useEffect } from "react";
import axios from "axios";

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books/allauthor")
      .then((response) => {
        setAuthors(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the authors!", error);
      });
  }, []);

  return (
    <div>
      <h2>Authors</h2>
      <ul>
        {authors.map((author) => (
          <li key={author}>{author}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
