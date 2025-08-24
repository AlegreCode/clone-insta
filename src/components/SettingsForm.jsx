import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Image, Save, BookText } from 'lucide-react';
import { getCurrentUser, completeUserProfile } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SettingsForm = ({ userData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const setFormValues = async () => {
      if (userData) {
        setValue('firstname', userData.firstname);
        setValue('lastname', userData.lastname);
        setValue('bio', userData.bio);
        if (userData.avatar) {
          setPreview(userData.avatar);
        } else {
          const { data: { user } } = await getCurrentUser();
          if (user && user.user_metadata && user.user_metadata.display_name) {
            const firstLetter = user.user_metadata.display_name.charAt(0).toUpperCase();
            setPreview(`https://placehold.co/150/add8e6/ffffff?text=${firstLetter}`);
          } else {
            setPreview(`https://placehold.co/150/add8e6/ffffff?text=U`);
          }
        }
      }
    };
    setFormValues();
  }, [userData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);
    try {
      await completeUserProfile(data.firstname, data.lastname, data.bio, data.avatar[0]);
      toast.success('¡Perfil actualizado con éxito!', {
        onClose: () => navigate('/profile'),
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="p-8 space-y-6 bg-white rounded-lg shadow-md">
      {success && (
        <div className="p-4 text-sm text-green-700 bg-green-100 border-l-4 border-green-500" role="alert">
          <p className="font-bold">¡Éxito!</p>
          <p>Tu perfil ha sido actualizado correctamente. Redirigiendo a tu perfil...</p>
        </div>
      )}
      <div className="flex items-center space-x-6">
        <div className="shrink-0">
          {preview && <img className="object-cover w-24 h-24 rounded-full" src={preview} alt="Current avatar" />}
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input type="file" {...register('avatar')} onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
        </label>
      </div>

      <div className="relative">
        <label htmlFor="firstname" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input id="firstname" type="text" {...register('firstname')} className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="lastname" className="text-sm font-medium text-gray-700">
          Apellido
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <input id="lastname" type="text" {...register('lastname')} className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="bio" className="text-sm font-medium text-gray-700">
          Biografía
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BookText className="w-5 h-5 text-gray-400" />
          </div>
          <textarea id="bio" {...register('bio')} rows="4" className="w-full py-2 pl-10 pr-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
      </div>

      <div>
        <button type="submit" disabled={loading} className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 cursor-pointer">
          <Save className="mr-2" size={18} />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};

export default SettingsForm;