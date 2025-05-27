import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { searchImages } from './API/pexels';

const categories = [
  {
    name: 'Nature',
    img: 'https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=400',
  },
  {
    name: 'Animals',
    img: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&h=400',
  },
  {
    name: 'Technology',
    img: 'https://images.pexels.com/photos/257897/pexels-photo-257897.jpeg?auto=compress&cs=tinysrgb&h=400',
  },
  {
    name: 'Food',
    img: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=400',
  },
  {
    name: 'Travel',
    img: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&h=400',
  },
  {
    name: 'Art',
    img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=400',
  },
  
];

function Explorar() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = async (category) => {
    setLoading(true);
    const results = await searchImages(category);
    setImages(results);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: '20px 60px 40px 120px', overflowY: 'auto', backgroundColor: '#fafafa' }}>
        <div style={{ maxWidth: 900, marginLeft: 'auto', marginRight: 0, marginBottom: 40 }}>
          <SearchBar onSearch={handleCategoryClick} />
        </div>

        <h2
          style={{
            color: '#333',
            fontSize: '2rem',
            fontWeight: '700',
            maxWidth: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Categorías
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: 960,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {categories.map(({ name, img }) => (
            <div
              key={name}
              onClick={() => handleCategoryClick(name)}
              style={{
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                position: 'relative',
                height: 220,
                backgroundColor: '#fff',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={img}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.75)',
                  transition: 'filter 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.6)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(0.75)')}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 15,
                  left: 20,
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.6rem',
                  textShadow: '0 0 8px rgba(0,0,0,0.8)',
                  userSelect: 'none',
                }}
              >
                {name}
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Cargando imágenes...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
              gap: '15px',
              marginTop: 40,
              maxWidth: 960,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {images.map((img) => (
              <img
                key={img.id}
                src={img.src.medium}
                alt={img.alt}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  cursor: 'pointer',
                  boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                  userSelect: 'none',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explorar;
