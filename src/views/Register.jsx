import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { getCurrentUser } from '../services/supabaseService';
import Loader from '../components/Loader';

const Register = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await getCurrentUser();
      if (user) {
        navigate('/');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">Crear Cuenta</h2>
        <RegisterForm />
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
