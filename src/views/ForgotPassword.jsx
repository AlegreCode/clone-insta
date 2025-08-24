import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgotPassword, getCurrentUser } from '../services/supabaseService';
import Loader from '../components/Loader';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await getCurrentUser();
      if (data.user) {
        navigate('/feed');
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      toast.info('Si el correo electrónico es válido, recibirás un enlace para restablecer tu contraseña.');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">¿Olvidaste tu contraseña?</h2>
        <p className="text-center text-gray-600">
          Ingresa tu correo electrónico y te enviaremos un enlace para que puedas volver a iniciar sesión. Una vez que hayas iniciado sesión, podrás cambiar tu contraseña en la sección de ajustes.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { required: 'El correo electrónico es obligatorio' })}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              Enviar enlace de inicio de sesión
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword