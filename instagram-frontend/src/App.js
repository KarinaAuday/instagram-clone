// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Feed from './components/Feed';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(null);
  const [currentPage, setCurrentPage] = useState(token ? 'feed' : 'login');

  const API_URL = 'http://localhost:3000/api';

  // Obtener perfil cuando hay token
  useEffect(() => {
    if (token) {
      obtenerPerfil();
    }
  }, [token]);

  const obtenerPerfil = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/perfil`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsuario(data.usuario);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogin = (newToken, user) => {
    setToken(newToken);
    setUsuario(user);
    localStorage.setItem('token', newToken);
    setCurrentPage('feed');
  };

  const handleRegister = (newToken, user) => {
    setToken(newToken);
    setUsuario(user);
    localStorage.setItem('token', newToken);
    setCurrentPage('feed');
  };

  const handleLogout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  const handleRefreshPerfil = () => {
    obtenerPerfil();
  };

  return (
    <div className="App">
      {token ? (
        <>
          {/* NAVBAR */}
          <nav className="navbar">
            <h1>📸 Instagram Clone</h1>
            <div className="nav-buttons">
              <button 
                className={currentPage === 'feed' ? 'active' : ''}
                onClick={() => setCurrentPage('feed')}
              >
                🏠 Feed
              </button>
              <button 
                className={currentPage === 'profile' ? 'active' : ''}
                onClick={() => setCurrentPage('profile')}
              >
                👤 Mi Perfil
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </nav>

          {/* CONTENIDO */}
          <div className="container">
            {currentPage === 'feed' && (
              <Feed token={token} usuario={usuario} apiUrl={API_URL} />
            )}
            {currentPage === 'profile' && (
              <Profile 
                token={token} 
                usuario={usuario} 
                apiUrl={API_URL}
                onRefresh={handleRefreshPerfil}
              />
            )}
          </div>
        </>
      ) : (
        <>
          {/* AUTH PAGES */}
          <div className="auth-container">
            <button 
              className={currentPage === 'login' ? 'active' : ''}
              onClick={() => setCurrentPage('login')}
            >
              🔐 Login
            </button>
            <button 
              className={currentPage === 'register' ? 'active' : ''}
              onClick={() => setCurrentPage('register')}
            >
              ✍️ Registrarse
            </button>
          </div>

          <div className="auth-form">
            {currentPage === 'login' && (
              <Login onLogin={handleLogin} apiUrl={API_URL} />
            )}
            {currentPage === 'register' && (
              <Register onRegister={handleRegister} apiUrl={API_URL} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
