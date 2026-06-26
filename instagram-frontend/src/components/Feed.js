// components/Feed.js
import React, { useState, useEffect } from 'react';

function Feed({ token, usuario, apiUrl }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [urlImagen, setUrlImagen] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerFeed();
  }, []);

  const obtenerFeed = async () => {
    try {
      const res = await fetch(`${apiUrl}/publicaciones`);
      const data = await res.json();
      setPublicaciones(data.publicaciones || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCrearPublicacion = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/publicaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          url_imagen: urlImagen,
          descripcion: descripcion
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUrlImagen('');
        setDescripcion('');
        obtenerFeed();
      } else {
        setError(data.error || 'Error al crear publicación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const darLike = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/publicaciones/${id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        obtenerFeed();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const eliminarPublicacion = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        const res = await fetch(`${apiUrl}/publicaciones/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          obtenerFeed();
        }
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return (
    <div className="feed">
      <h2>📸 Feed</h2>

      {/* CREAR PUBLICACIÓN */}
      <div className="create-post">
        <h3>Crear Publicación</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleCrearPublicacion}>
          <input
            type="url"
            placeholder="URL de la imagen (https://...)"
            value={urlImagen}
            onChange={(e) => setUrlImagen(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Publicando...' : '📤 Publicar'}
          </button>
        </form>
      </div>

      {/* LISTA DE PUBLICACIONES */}
      <div className="posts-list">
        {publicaciones.length === 0 ? (
          <p>No hay publicaciones aún</p>
        ) : (
          publicaciones.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img src={post.foto_perfil} alt="avatar" className="avatar" />
                <div>
                  <h4>{post.nombre_usuario}</h4>
                </div>
                {post.usuario_id === usuario?.id && (
                  <button 
                    className="delete-btn"
                    onClick={() => eliminarPublicacion(post.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>

              <img src={post.url_imagen} alt="post" className="post-image" />

              <div className="post-actions">
                <button 
                  className="like-btn"
                  onClick={() => darLike(post.id)}
                >
                  ❤️ {post.likes}
                </button>
              </div>

              {post.descripcion && (
                <p className="post-description">{post.descripcion}</p>
              )}

              <p className="post-date">
                {new Date(post.fecha_creacion).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Feed;
