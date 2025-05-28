import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './LoginRegister.css';

function LoginRegister({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Nuevo estado para toggle: true = registro, false = login
  const [isRegister, setIsRegister] = useState(false);

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

  const showModalMessage = (msg) => {
    setMessageText(msg);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // Registro
      if (!username.trim()) {
        showModalMessage('Debes ingresar un nombre de usuario para registrarte');
        return;
      }

      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        showModalMessage('Error al registrarse: ' + signupError.message);
        return;
      }

      const user = signupData.user;

      if (!user) {
        showModalMessage('Verifica tu correo electrónico para completar el registro.');
        return;
      }

      // Crear perfil con username
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id,
        username,
        avatar_url: '',
        is_admin: false,
      });

      if (insertError) {
        showModalMessage('Error al crear perfil: ' + insertError.message);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      setLoggedInUser(user);
      showModalMessage('Registrado correctamente. Por favor confirma tu email antes de iniciar sesión.');
      setIsRegister(false); // Cambiar a login después de registro
      return;
    }

    // Login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      showModalMessage('Error al iniciar sesión: ' + loginError.message);
      return;
    }

    localStorage.setItem('user', JSON.stringify(loginData.user));
    setLoggedInUser(loginData.user);

    // Cargar perfil asociado
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (profile) setUserProfile(profile);

    showModalMessage('Inicio de sesión exitoso');
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
        <div className="simple-message-modal">{messageText}</div>
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
              <h2 className="title">{isRegister ? '📝 Registrarse' : '🔐 Iniciar sesión'}</h2>

              <form onSubmit={handleSubmit} className="form">
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
                {isRegister && (
                  <input
                    className="input"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isRegister}
                  />
                )}
                <div className="btn-group" style={{ justifyContent: 'space-between', marginTop: 10 }}>
                  <button type="submit" className="btn primary">
                    {isRegister ? 'Registrarse' : 'Entrar'}
                  </button>

                  <button
                    type="button"
                    className="btn toggle"
                    onClick={() => setIsRegister(!isRegister)}
                  >
                    {isRegister ? '¿Ya tienes cuenta? Iniciar sesión' : '¿No tienes cuenta? Registrarse'}
                  </button>
                </div>
                <div className="btn-group">
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
