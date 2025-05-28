import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Slidebar from './Sidebar';

function Configuracion() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const loadUserProfile = async () => {
      const sessionUser = supabase.auth.getUser();
      const { data: { user } } = await sessionUser;
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    };
    loadUserProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username: profile.username, avatar_url: profile.avatar_url })
      .eq('id', user.id);

    alert(error ? 'Error actualizando perfil: ' + error.message : 'Perfil actualizado');
  };

  const handleDeleteAccount = async () => {
    if (!user || !window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) return;

    const { error: profileError } = await supabase.from('profiles').delete().eq('id', user.id);
    if (profileError) return alert('Error al borrar perfil: ' + profileError.message);

    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    if (authError) return alert('Error al borrar cuenta: ' + authError.message);

    alert('Cuenta eliminada');
    setUser(null);
    setProfile(null);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (loginError) return setAdminError('Error en login: ' + loginError.message);

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', loginData.user.id)
      .single();

    if (!adminProfile?.is_admin) {
      setAdminError('No tienes permisos de administrador');
      await supabase.auth.signOut();
      return;
    }

    setIsAdminMode(true);
    setUser(loginData.user);

    const { data: allUsers } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .neq('id', loginData.user.id);

    setUsersList(allUsers || []);
  };

  const handleAdminDeleteUser = async (userId) => {
    if (!window.confirm('¿Eliminar esta cuenta? Esta acción no se puede deshacer.')) return;

    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
    if (profileError) return alert('Error al borrar perfil: ' + profileError.message);

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) return alert('Error al borrar usuario: ' + authError.message);

    alert('Usuario eliminado');
    setUsersList(usersList.filter(u => u.id !== userId));
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando...</p>;

  // 💅 Estilos modernos:
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    background: '#f9f9f9',
  };

  const contentStyle = {
    flex: 1,
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    background: '#fff',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    marginTop: '2rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    margin: '12px 0',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
    transition: '0.3s',
  };

  const dangerButton = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
  };

  const hoverButton = {
    ...buttonStyle,
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <Slidebar />
      <div style={contentStyle}>
        {user && !isAdminMode && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Configuración de perfil</h2>
            <form onSubmit={handleProfileUpdate}>
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={profile?.username || ''}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                style={inputStyle}
              />
              <label>URL del Avatar</label>
              <input
                type="text"
                value={profile?.avatar_url || ''}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyle}>Guardar cambios</button>
            </form>
            <button onClick={handleDeleteAccount} style={dangerButton}>Eliminar cuenta</button>
          </>
        )}

        {(!user || !isAdminMode) && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Ingreso Administrador</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="email"
                placeholder="Correo del administrador"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <button type="submit" style={buttonStyle}>Entrar como admin</button>
            </form>
            {adminError && <p style={{ color: 'red', marginTop: '1rem' }}>{adminError}</p>}
          </>
        )}

        {isAdminMode && user && (
          <>
            <h2 style={{ marginBottom: '20px' }}>Modo Administrador - Eliminar cuentas</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {usersList.map(u => (
                <li key={u.id} style={{
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <strong>{u.username}</strong>
                    {u.avatar_url && (
                      <img
                        src={u.avatar_url}
                        alt="avatar"
                        width="40"
                        height="40"
                        style={{ marginLeft: '1rem', borderRadius: '50%' }}
                      />
                    )}
                  </div>
                  <button
                    style={dangerButton}
                    onClick={() => handleAdminDeleteUser(u.id)}
                  >
                    Eliminar cuenta
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setIsAdminMode(false);
                setUser(null);
                setUsersList([]);
              }}
              style={buttonStyle}
            >
              Cerrar sesión admin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Configuracion;
