import React, { useEffect, useState } from 'react';
import { searchImages } from './API/pexels';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async (query = 'nature') => {
    const results = await searchImages(query);
    setImages(results);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Abrir modal con imagen seleccionada
  const openModal = (img) => {
    setSelectedImage(img);
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  // Función para "guardar" imagen (descargar)
  const saveImage = () => {
    if (!selectedImage) return;
    const link = document.createElement('a');
    link.href = selectedImage.src.large;
    link.download = `pexels-image-${selectedImage.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Estilos inline tipo Pinterest para modal y botones
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      textAlign: 'center',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modalImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      marginBottom: 20,
      objectFit: 'contain',
    },
    modalButtons: {
      display: 'flex',
      gap: 12,
    },
    btnSave: {
      backgroundColor: '#e60023',
      color: 'white',
      border: 'none',
      padding: '10px 26px',
      borderRadius: 28,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(230,0,35,0.5)',
      transition: 'background-color 0.3s ease',
    },
    btnSaveHover: {
      backgroundColor: '#b8001a',
    },
    btnClose: {
      backgroundColor: '#f2f2f2',
      color: '#333',
      border: 'none',
      padding: '10px 26px',
      borderRadius: 28,
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    btnCloseHover: {
      backgroundColor: '#d6d6d6',
      color: '#000',
    }
  };

  // Para manejar hover inline sin librerías externas, aquí un hack con useState:
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <SearchBar onSearch={fetchImages} />
        <div className="image-grid">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.src.medium}
              alt={img.alt}
              style={{ cursor: 'pointer' }}
              onClick={() => openModal(img)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedImage && (
        <div 
          className="modal-overlay" 
          onClick={closeModal} 
          style={styles.modalOverlay}
        >
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={styles.modalContent}
          >
            <img 
              src={selectedImage.src.large} 
              alt={selectedImage.alt} 
              style={styles.modalImage}
            />
            <div style={styles.modalButtons}>
              <button
                onClick={saveImage}
                style={hoverSave ? {...styles.btnSave, ...styles.btnSaveHover} : styles.btnSave}
                onMouseEnter={() => setHoverSave(true)}
                onMouseLeave={() => setHoverSave(false)}
              >
                Guardar
              </button>
              <button
                onClick={closeModal}
                style={hoverClose ? {...styles.btnClose, ...styles.btnCloseHover} : styles.btnClose}
                onMouseEnter={() => setHoverClose(true)}
                onMouseLeave={() => setHoverClose(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
