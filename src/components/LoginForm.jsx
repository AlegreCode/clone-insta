
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/supabaseService';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      setLoginError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginError && <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">{loginError}</div>}
      <div className="relative">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'El correo electrónico es requerido' })}
            className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div className="relative">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'La contraseña es requerida' })}
            className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
        >
          <LogIn className="mr-2" size={18} />
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
