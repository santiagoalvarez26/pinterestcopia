import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Configuracion() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [usersList, setUsersList] = useState([]);

  // Cargar usuario y perfil actual
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

  // Actualizar perfil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username: profile.username, avatar_url: profile.avatar_url })
      .eq('id', user.id);

    if (error) alert('Error actualizando perfil: ' + error.message);
    else alert('Perfil actualizado');
  };

  // Eliminar cuenta propia
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es irreversible.')) return;

    // Borrar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      alert('Error al borrar perfil: ' + profileError.message);
      return;
    }

    // Borrar usuario auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      alert('Error al borrar cuenta: ' + authError.message);
      return;
    }

    alert('Cuenta eliminada');
    setUser(null);
    setProfile(null);
  };

  // Login admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (loginError) {
      setAdminError('Error en login: ' + loginError.message);
      return;
    }

    // Verificar si es admin
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

    // Cargar lista de usuarios (excepto admin)
    const { data: allUsers } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .neq('id', loginData.user.id);

    setUsersList(allUsers || []);
  };

  // Eliminar usuario admin
  const handleAdminDeleteUser = async (userId) => {
    if (!window.confirm('¿Eliminar esta cuenta? Esta acción no se puede deshacer.')) return;

    // Borrar perfil
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);

    if (profileError) {
      alert('Error al borrar perfil: ' + profileError.message);
      return;
    }

    // Borrar usuario auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      alert('Error al borrar usuario: ' + authError.message);
      return;
    }

    alert('Usuario eliminado');

    // Actualizar lista
    setUsersList(usersList.filter(u => u.id !== userId));
  };

  if (loading) return <p>Cargando...</p>;

  // Si usuario logueado normal (no admin)
  if (user && !isAdminMode) {
    return (
      <div>
        <h2>Configuración de perfil</h2>
        <form onSubmit={handleProfileUpdate}>
          <label>
            Usuario:
            <input
              type="text"
              value={profile?.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
          </label>
          <label>
            URL Avatar:
            <input
              type="text"
              value={profile?.avatar_url || ''}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
            />
          </label>
          <button type="submit">Guardar cambios</button>
        </form>
        <button onClick={handleDeleteAccount} style={{ marginTop: '1rem', color: 'red' }}>
          Eliminar cuenta
        </button>
      </div>
    );
  }

  // Si no logueado o no admin, mostrar login admin para eliminar cuentas
  if (!user || !isAdminMode) {
    return (
      <div>
        <h2>Ingreso Administrador</h2>
        <form onSubmit={handleAdminLogin}>
          <input
            type="email"
            placeholder="Correo admin"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña admin"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar como admin</button>
        </form>
        {adminError && <p style={{ color: 'red' }}>{adminError}</p>}
      </div>
    );
  }

  // Si admin logueado, mostrar lista usuarios para eliminar
  if (isAdminMode && user) {
    return (
      <div>
        <h2>Modo Administrador - Eliminar cuentas</h2>
        <ul>
          {usersList.map(u => (
            <li key={u.id} style={{ marginBottom: '1rem' }}>
              <strong>{u.username}</strong>
              {u.avatar_url && <img src={u.avatar_url} alt="avatar" width="40" style={{ marginLeft: '1rem' }} />}
              <button
                style={{ marginLeft: '1rem', color: 'red' }}
                onClick={() => handleAdminDeleteUser(u.id)}
              >
                Eliminar cuenta
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => {
          setIsAdminMode(false);
          setUser(null);
          setUsersList([]);
        }}>
          Cerrar sesión admin
        </button>
      </div>
    );
  }
}

export default Configuracion;
