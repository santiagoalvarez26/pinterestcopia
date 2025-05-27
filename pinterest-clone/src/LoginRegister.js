import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './LoginRegister.css';

function LoginRegister({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

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

      if (signupError) return alert('Error al registrarse: ' + signupError.message);

      const user = signupData.user;

      // Crear perfil si no existe
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

        if (insertError) return alert('Error al crear perfil: ' + insertError.message);
      }

      localStorage.setItem('user', JSON.stringify(user));
      setLoggedInUser(user);
      alert('Registrado y logueado correctamente');
    } else {
      localStorage.setItem('user', JSON.stringify(loginData.user));
      setLoggedInUser(loginData.user);
      alert('Inicio de sesión exitoso');
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
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        {loggedInUser ? (
          <>
            <h2>Bienvenido</h2>
            <p><strong>Correo:</strong> {loggedInUser.email}</p>
            <p><strong>Usuario:</strong> {userProfile?.username || loggedInUser.email}</p>
            {userProfile?.avatar_url && (
              <img src={userProfile.avatar_url} alt="Avatar" width="80" />
            )}
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={onClose}>Cerrar</button>
          </>
        ) : (
          <>
            <h2>Iniciar sesión / Registrarse</h2>
            <form onSubmit={handleLoginOrRegister}>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Entrar / Registrarse</button>
              <button type="button" onClick={onClose}>Cerrar</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;
