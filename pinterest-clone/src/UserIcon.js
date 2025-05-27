import React, { useState } from 'react';
import LoginRegister from './LoginRegister'; // Asegúrate que esté en la ruta correcta

const userIcons = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#333"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
      </svg>
    ),
    label: 'Login',
  },
];

function UserIcon() {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => setShowLogin(!showLogin);

  return (
    <>
      {userIcons.map(({ icon, label }, index) => (
        <div
          key={index}
          onClick={toggleLogin}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 2000,
            cursor: 'pointer',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          title={`Abrir ${label}`}
        >
          {icon}
        </div>
      ))}

      {showLogin && <LoginRegister onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default UserIcon;
