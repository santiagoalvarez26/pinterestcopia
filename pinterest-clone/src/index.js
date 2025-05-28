import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Explorar from './Explorar';
import Crear from './Crear';  
import Configuracion from './Configuracion'; 

import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />             
        <Route path="/explorar" element={<Explorar />} /> 
        <Route path="/crear" element={<Crear />} /> 
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
