import React, { useState, useEffect } from "react";
import axios from "axios";

const GenreList = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books/allgenre")
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the genres!", error);
      });
  }, []);

  return (
    <div>
      <h2>Genres</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    </div>
  );
};

export default GenreList;
