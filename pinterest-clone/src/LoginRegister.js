import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './LoginRegister.css';

function LoginRegister({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Estado para el modal de mensaje simple
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const loadUserAndProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) setUserProfile(profile);
      }
    };
    loadUserAndProfile();
  }, []);

  // Función para mostrar el modal con mensaje y ocultarlo después de 2.5s
  const showModalMessage = (msg) => {
    setMessageText(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        showModalMessage('Error al registrarse: ' + signupError.message);
        return;
      }

      const user = signupData.user;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          username: email.split('@')[0],
          avatar_url: '',
          is_admin: false,
        });

        if (insertError) {
          showModalMessage('Error al crear perfil: ' + insertError.message);
          return;
        }
      }

      localStorage.setItem('user', JSON.stringify(user));
      setLoggedInUser(user);
      showModalMessage('Registrado y logueado correctamente');
    } else {
      localStorage.setItem('user', JSON.stringify(loginData.user));
      setLoggedInUser(loginData.user);
      showModalMessage('Inicio de sesión exitoso');
    }

    onClose();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    setLoggedInUser(null);
    setUserProfile(null);
  };

  return (
    <>
      {showMessage && (
        <div className="simple-message-modal">
          {messageText}
        </div>
      )}

      <div className="login-overlay">
        <div className="login-card">
          {loggedInUser ? (
            <>
              <h2 className="title">Bienvenido</h2>
              <div className="profile-info">
                <p><strong>📧 Correo:</strong> {loggedInUser.email}</p>
                <p><strong>👤 Usuario:</strong> {userProfile?.username || loggedInUser.email}</p>
                {userProfile?.avatar_url && (
                  <img className="avatar" src={userProfile.avatar_url} alt="Avatar" />
                )}
              </div>
              <div className="btn-group">
                <button className="btn logout" onClick={handleLogout}>Cerrar sesión</button>
                <button className="btn secondary" onClick={onClose}>Cerrar</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="title">🔐 Iniciar sesión / Registrarse</h2>
              <form onSubmit={handleLoginOrRegister} className="form">
                <input
                  className="input"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="input"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="btn-group">
                  <button type="submit" className="btn primary">Entrar / Registrarse</button>
                  <button type="button" className="btn secondary" onClick={onClose}>Cerrar</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default LoginRegister;
