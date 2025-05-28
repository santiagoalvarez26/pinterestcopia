import React, { useState } from 'react';
import './Sidebar.css';
import {
  Home,
  Compass,
  Plus,
  Bell,
  MessageCircle,
  Settings,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Menú lateral con rutas excepto "Actualizaciones" que es toggle de panel
const menuItems = [
  { icon: <Home size={24} />, label: 'Inicio', path: '/' },
  { icon: <Compass size={24} />, label: 'Explorar', path: '/explorar' },
  { icon: <Plus size={24} />, label: 'Crear', path: '/crear' },
  { icon: <Bell size={24} />, label: 'Actualizaciones' }, // Sin ruta, abre panel
  { icon: <MessageCircle size={24} />, label: 'Mensajes', path: '/mensajes' },
  

];

// Notificaciones para el panel "Actualizaciones"
const notifications = [
  { text: 'Nueva categoría: Naturaleza', icon: <Bell size={36} color="#e63946" /> },
  { text: 'Top imágenes de Arte', icon: <Star size={36} color="#f1faee" /> },
  { text: 'Diseño más visto', icon: <AlertCircle size={36} color="#a8dadc" /> },
  { text: 'Este diseño es para ti', icon: <CheckCircle size={36} color="#457b9d" /> },
  { text: 'Actualización de perfil disponible', icon: <Info size={36} color="#1d3557" /> },
  { text: 'Nuevos filtros añadidos', icon: <Bell size={36} color="#e63946" /> },
  { text: 'Consejo: Explora lo más popular', icon: <Star size={36} color="#f1faee" /> },
  { text: 'Evento especial esta semana', icon: <AlertCircle size={36} color="#a8dadc" /> },
  { text: 'Tus colecciones han crecido', icon: <CheckCircle size={36} color="#457b9d" /> },
  { text: 'Descubre nuevos artistas', icon: <Info size={36} color="#1d3557" /> },
  { text: 'Mejoras en la búsqueda', icon: <Bell size={36} color="#e63946" /> },
  { text: 'Tu pin favorito fue destacado', icon: <Star size={36} color="#f1faee" /> },
  { text: 'Nuevas plantillas para crear', icon: <AlertCircle size={36} color="#a8dadc" /> },
  { text: '¡Feliz Día del Diseño!', icon: <CheckCircle size={36} color="#457b9d" /> },
  { text: 'Tips para aumentar tus seguidores', icon: <Info size={36} color="#1d3557" /> },
  { text: 'Actualización en términos de uso', icon: <Bell size={36} color="#e63946" /> },
  { text: 'Recomendaciones personalizadas', icon: <Star size={36} color="#f1faee" /> },
  { text: 'Tutorial: Cómo usar colecciones', icon: <AlertCircle size={36} color="#a8dadc" /> },
  { text: 'Nuevo diseño para tu perfil', icon: <CheckCircle size={36} color="#457b9d" /> },
  { text: 'Explora contenido exclusivo', icon: <Info size={36} color="#1d3557" /> },
];

function Sidebar() {
  const [showUpdates, setShowUpdates] = useState(false);

  const handleToggleUpdates = () => {
    setShowUpdates(!showUpdates);
  };

  return (
    <>
      <div className="sidebar">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png"
          alt="Pinterest"
          className="logo"
        />
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar-item">
                {item.label === 'Actualizaciones' ? (
                  // Botón para toggle panel Actualizaciones
                  <button
                    onClick={handleToggleUpdates}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    aria-label="Mostrar actualizaciones"
                  >
                    {item.icon}
                    <span className="tooltip">{item.label}</span>
                  </button>
                ) : (
                  // Link normal con ruta para otras opciones
                  <Link
                    to={item.path}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                    <span className="tooltip">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="bottom sidebar-item">
          <Link
            to="/configuracion"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Settings size={24} />
            <span className="tooltip">Configuración</span>
          </Link>
        </div>
      </div>

      {/* Panel de actualizaciones (overlay) */}
      {showUpdates && (
        <div style={styles.overlay} onClick={() => setShowUpdates(false)}>
          <div style={styles.updatesPanel} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.title}>Novedades</h2>
            <div style={styles.gridScroll}>
              {notifications.map(({ text, icon }, i) => (
                <div key={i} style={styles.cardIcon}>
                  {icon}
                  <p style={styles.cardText}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: '80px', // justo al lado del sidebar
    width: 'calc(100% - 80px)',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'flex-start', // aparece desde la izquierda
    alignItems: 'flex-start',
    padding: '40px 60px',
  },
  updatesPanel: {
    width: '400px',
    maxHeight: '80vh',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    animation: 'fadeInLeft 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#111',
  },
  gridScroll: {
    overflowY: 'auto',
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: '1fr',
  },
  cardIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px 12px',
    borderRadius: '12px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardText: {
    fontSize: '16px',
    color: '#333',
    margin: 0,
  },
};

export default Sidebar;
