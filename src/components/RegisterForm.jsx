import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register as registerUser } from '../services/supabaseService';

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const password = useRef({});
  password.current = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data.email, data.password, data.username);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Nombre de Usuario
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              {...register('username', { required: 'El nombre de usuario es requerido' })}
              className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>}
        </div>
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
              className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
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
              {...register('password', {
                required: 'La contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div className="relative">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Repetir Contraseña
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Por favor, confirma la contraseña',
                validate: value =>
                  value === password.current || 'Las contraseñas no coinciden'
              })}
              className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          >
            <UserPlus className="mr-2" size={18} />
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;