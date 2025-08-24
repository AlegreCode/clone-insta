import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/supabaseService';
import Loader from './Loader';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await getCurrentUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return user ? children : <Unauthorized />;
};

export default ProtectedRoute;
