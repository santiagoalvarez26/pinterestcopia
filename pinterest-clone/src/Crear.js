import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';

function Crear() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) fetchUserImages();
  }, [user]);

  const fetchUserImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setImages(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('user-images')
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('user-images')
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase
      .from('images')
      .insert([{ user_id: user.id, image_url: publicUrlData.publicUrl }]);

    if (!insertError) {
      setSelectedFile(null);
      fetchUserImages();
    } else {
      console.error('Insert error:', insertError.message);
    }

    setUploading(false);
  };

  const handleDelete = async (image) => {
    const path = image.image_url.split('/user-images/')[1];

    const { error: deleteStorageError } = await supabase
      .storage
      .from('user-images')
      .remove([path]);

    const { error: deleteDbError } = await supabase
      .from('images')
      .delete()
      .eq('id', image.id);

    if (!deleteStorageError && !deleteDbError) {
      setImages(images.filter((img) => img.id !== image.id));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '80px', padding: '50px', boxSizing: 'border-box', flex: 1 }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '30px' }}>
          Crear publicación
        </h1>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div
            style={{
              border: '3px dashed #ccc',
              borderRadius: '16px',
              width: '300px',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f8f8f8',
              cursor: 'pointer',
              position: 'relative',
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
            <span style={{ color: '#666', textAlign: 'center' }}>
              Haz clic aquí para cargar tu imagen
            </span>
          </div>

          {selectedFile && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                style={{
                  width: '300px',
                  height: 'auto',
                  borderRadius: '16px',
                  marginBottom: '10px',
                }}
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#e60023',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {uploading ? 'Subiendo...' : 'Subir imagen'}
              </button>
            </div>
          )}
        </div>

        <hr style={{ margin: '40px 0' }} />

        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Tus imágenes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((img) => (
            <div key={img.id} style={{ position: 'relative' }}>
              <img
                src={img.image_url}
                alt="subida"
                style={{
                  width: '200px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <button
                onClick={() => handleDelete(img)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
          {images.length === 0 && <p>No has subido imágenes aún.</p>}
        </div>
      </div>
    </div>
  );
}

export default Crear;
