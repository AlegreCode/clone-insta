import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadPost from '../components/UploadPost';
import Post from '../components/Post';
import { Upload, X, CameraOff } from 'lucide-react';
import '../App.css';
import { getUserData, getAllPostsWithUser, uploadPost } from '../services/supabaseService';
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Feed = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        const userData = await getUserData();
        if (!userData) {
          navigate('/login');
          return;
        }
        setUser(userData);
        
        const fetchedPosts = await getAllPostsWithUser();
        setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      } catch (error) {
        if (error.name !== 'AuthSessionMissingError') {
          console.error('Error checking user or fetching posts:', error);
        }
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAndFetch();
  }, [navigate]);

  const handleUpload = async (data) => {
    try {
      const newPost = await uploadPost(data.description, data.image[0], user.auth_user_id, user.id);
      const fetchedPosts = await getAllPostsWithUser();
      setPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);
      setShowUpload(false);
      toast.success('Publicación subida con éxito');
    } catch (error) {
      console.error('Error uploading post:', error);
      toast.error('Error al subir la publicación');
    }
  };

  const toggleUpload = () => {
    if (!user?.username) {
      toast.warn(
        <div>
          Completa tu perfil para poder publicar.
          <button onClick={() => navigate('/settings')} className="ml-2 px-2 py-1 text-sm font-bold text-white bg-indigo-500 rounded">
            Ir a Ajustes
          </button>
        </div>, 
        {
          autoClose: 5000,
          closeOnClick: true
        }
      );
      return;
    }

    if (showUpload) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowUpload(false);
        setIsAnimating(false);
      }, 500);
    } else {
      setShowUpload(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <ToastContainer />
      <h2 className="mb-6 text-3xl font-bold text-center">Últimas publicaciones</h2>
      <div className="mb-8 flex justify-center md:justify-end">
        <button
          onClick={toggleUpload}
          className="flex items-center w-full md:w-auto justify-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
        >
          {showUpload ? (
            <><X className="mr-2" size={18} />Cancelar</>
          ) : (
            <><Upload className="mr-2" size={18} />Subir Publicación</>
          )}
        </button>
      </div>
      {(showUpload || isAnimating) && (
        <div className={showUpload && !isAnimating ? 'slide-down' : 'slide-up'}>
          <UploadPost onUpload={handleUpload} />
        </div>
      )}

      <div className="mt-8 space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} user={user} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-gray-400 bg-gray-50">
            <CameraOff className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700">No hay publicaciones todavía</h3>
            <p className="mt-2">¡Sé el primero en compartir una foto!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
