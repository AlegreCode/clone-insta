import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import ProfilePostCard from '../components/ProfilePostCard';
import { getUserData, getCurrentUser, getPostsByUserId, deletePost } from '../services/supabaseService';
import { AlertCircle, Info, CameraOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await getCurrentUser();
        setUser(user);
        const data = await getUserData();
        setUserData(data);
        if (data?.id) {
          const userPosts = await getPostsByUserId(data.id);
          setPosts(userPosts);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDeletePost = async (post) => {
    try {
      await deletePost(post);
      setPosts(posts.filter(p => p.id !== post.id));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Error deleting post.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl p-8 mx-auto">
      <div className="flex flex-col items-center mb-8 sm:flex-row sm:items-start">
        <img
          src={userData?.avatar || `https://placehold.co/150x150/E0F2FE/0EA5E9/png?text=${user?.user_metadata?.display_name?.charAt(0).toUpperCase() || 'U'}`}
          alt={userData?.firstname || 'User'}
          className="object-cover w-32 h-32 mr-0 rounded-full sm:mr-8 mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
            {userData?.firstname && userData?.lastname ? `${userData.firstname} ${userData.lastname}` : (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Tu perfil está incompleto. {' '}
                      <Link to="/settings" className="font-medium text-yellow-800 underline hover:text-yellow-900">
                        Añade tu nombre y apellido en ajustes.
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </h2>
          <p className="text-base text-gray-500">
            {userData?.bio || (
                <span className="flex items-center">
                    <Info className="w-4 h-4 mr-2 text-gray-400" />
                    No has añadido ninguna biografía. {' '}
                    <Link to="/settings" className="ml-1 font-medium text-indigo-600 hover:text-indigo-500">
                        Añadir biografía
                    </Link>
                </span>
            )}
          </p>
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-2xl font-bold">Publicaciones</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ProfilePostCard key={post.id} post={post} onDeletePost={handleDeletePost} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg">
            <CameraOff className="w-16 h-16 mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-700">No hay publicaciones</h3>
            <p className="text-gray-500">Cuando publiques algo, aparecerá aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;