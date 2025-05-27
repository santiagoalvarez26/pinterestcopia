import React, { useState } from 'react';
import Sidebar from './Sidebar';

function Crear() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedImage(null);
      }, 2000); // Auto cierre en 2s
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '80%', maxWidth: '1200px' }}>
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '40px',
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111',
            }}
          >
            Crear publicación
          </h1>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '40px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                border: '3px dashed #ccc',
                borderRadius: '16px',
                width: '400px',
                height: '400px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f8f8f8',
                cursor: 'pointer',
                position: 'relative',
                transition: '0.3s',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
              <span style={{ color: '#666', padding: 20, textAlign: 'center', fontSize: '18px' }}>
                Haz clic aquí para cargar tu imagen
              </span>
            </div>

            {selectedImage && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={selectedImage}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    height: 'auto',
                    borderRadius: '16px',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
                    marginBottom: '25px',
                  }}
                />
                <button
                  onClick={handleUpload}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#e60023',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Subir imagen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal animada simple */}
      {uploadSuccess && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              animation: 'popIn 0.4s ease-out',
              boxShadow: '0 0 20px rgba(0,0,0,0.25)',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#28a745"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-check"
              style={{ animation: 'draw 0.4s ease forwards' }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes draw {
          0% { stroke-dasharray: 48; stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }

        .feather-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
        }
      `}</style>
    </div>
  );
}

export default Crear;
