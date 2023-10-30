import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [startSearch, setStartSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  useEffect(() => {
    // Function to fetch images based on the search term
    const fetchImages = async () => {
      try {
        if (!images) { setIsLoading(true); }
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=10&page=${images.length / 10 + 1}`,
          {
            headers: {
              Authorization: 'Client-ID TwL1lqEjVG9-TKzUeHM-5CP31g6IpLPQf5RfeNJaj80',
            },
          }
        );

        const newImages = response.data.results;
        setImages([...images, ...newImages]);
        if (isLoading) { setIsLoading(false); }
        if (continueLoading) { setContinueLoading(false); }
      } catch (error) {
        console.error('Error fetching images:', error);
        if (isLoading) { setIsLoading(false); }
        if (continueLoading) { setContinueLoading(false); }
      }
    };

    if (startSearch) {
      fetchImages();
      setStartSearch(false);
    }
  }, [searchTerm, images, startSearch, isLoading, continueLoading]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  const handleClick = () => {
    setImages([]);
    setStartSearch(true);
  }

  const handleExpand = () => {
    setStartSearch(true);
  }

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    if (bottom && !continueLoading) {
      setContinueLoading(true);
      setStartSearch(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div>
      <input type="text" name="searchInput" onChange={(e) => handleSearch(e)} placeholder="Search for images" />
      <button onClick={handleClick}>Search</button>
      <button onClick={handleExpand}>Expand</button>
      {
        isLoading &&
        <div className="spinner-container">
          <div className="loading-spinner">
          </div>
        </div>
      }

      <div id='container'>
        {images.map((image) => (
          <img key={image.id} src={image.urls.small} alt={image.description} />
        ))}
      </div>
      {
        continueLoading &&
        <div className="spinner-container">
          <div className="loading-spinner">
          </div>
        </div>
      }
    </div>
  );
};

export default App;
