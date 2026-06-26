// components/Profile.js
import React, { useState } from 'react';

function Profile({ token, usuario, apiUrl, onRefresh }) {
  const [editMode, setEditMode] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState(usuario?.nombre_completo || '');
  const [biografia, setBiografia] = useState(usuario?.biografia || '');
  const [fotoPerfil, setFotoPerfil] = useState(usuario?.foto_perfil || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleActualizar = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/usuarios/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_completo: nombreCompleto,
          biografia: biografia,
          foto_perfil: fotoPerfil
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Perfil actualizado');
        setEditMode(false);
        onRefresh();
      } else {
        setError(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="profile">
      <h2>👤 Mi Perfil</h2>

      <div className="profile-card">
        <div className="profile-header">
          <img src={usuario.foto_perfil} alt="perfil" className="profile-pic" />
          <div className="profile-info">
            <h3>@{usuario.nombre_usuario}</h3>
            <h4>{usuario.nombre_completo}</h4>
            <p>{usuario.email}</p>
            <p className="biografia">{usuario.biografia || 'Sin biografía'}</p>
            <p className="stats">
              📸 {usuario.totalPublicaciones} publicaciones
            </p>
          </div>
        </div>

        {!editMode ? (
          <button className="edit-btn" onClick={() => setEditMode(true)}>
            ✏️ Editar Perfil
          </button>
        ) : (
          <form onSubmit={handleActualizar} className="edit-form">
            <h3>Editar Perfil</h3>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <label>Nombre Completo</label>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />

            <label>Biografía</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              rows="3"
              placeholder="Escribe tu biografía..."
            ></textarea>

            <label>Foto de Perfil (URL)</label>
            <input
              type="url"
              value={fotoPerfil}
              onChange={(e) => setFotoPerfil(e.target.value)}
              placeholder="https://..."
            />

            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? '⏳ Guardando...' : '💾 Guardar'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MIS PUBLICACIONES */}
      <div className="my-posts">
        <h3>Mis Publicaciones ({usuario.totalPublicaciones})</h3>
        {usuario.publicaciones && usuario.publicaciones.length > 0 ? (
          <div className="posts-grid">
            {usuario.publicaciones.map(post => (
              <div key={post.id} className="post-thumbnail">
                <img src={post.url_imagen} alt="post" />
                <div className="post-overlay">
                  <p>❤️ {post.likes}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes publicaciones aún</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
