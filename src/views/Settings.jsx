import React, { useState, useEffect } from 'react';
import SettingsForm from '../components/SettingsForm';
import Loader from '../components/Loader';
import { getUserData, updatePassword, deleteCurrentUserAccount } from '../services/supabaseService';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const newPassword = watch("newPassword");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const onSubmit = async (data) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡actualízala!',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await updatePassword(data.newPassword);
            toast.success('¡Contraseña actualizada con éxito!');
            reset();
        } catch (error) {
            toast.error(error.message);
        }
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: '¿Estás absolutamente seguro?',
      text: "Esta acción es irreversible y eliminará permanentemente tu cuenta, posts y comentarios.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar mi cuenta',
      cancelButtonText: 'No, cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteCurrentUserAccount();
        toast.success('Tu cuenta ha sido eliminada.');
        navigate('/login');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-center">Ajustes de Perfil</h1>
      <SettingsForm userData={userData} />

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Actualizar Contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
              Contraseña Actual
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.currentPassword ? 'border-red-500' : ''}`}
              id="current-password"
              type="password"
              placeholder="******************"
              {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
            />
            {errors.currentPassword && <p className="text-red-500 text-xs italic">{errors.currentPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
              Nueva Contraseña
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.newPassword ? 'border-red-500' : ''}`}
              id="new-password"
              type="password"
              placeholder="******************"
              {...register("newPassword", { 
                  required: "La nueva contraseña es obligatoria", 
                  minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" } 
              })}
            />
            {errors.newPassword && <p className="text-red-500 text-xs italic">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
              Confirmar Nueva Contraseña
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
              id="confirm-password"
              type="password"
              placeholder="******************"
              {...register("confirmPassword", { 
                  required: "Por favor, confirma la nueva contraseña",
                  validate: value => value === newPassword || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center justify-center md:justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer w-full md:w-auto"
              type="submit"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Zona de Peligro</h2>
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Eliminar cuenta</p>
          <p>Una vez que eliminas tu cuenta, no hay vuelta atrás. Por favor, ten la certeza.</p>
        </div>
        <div className="flex items-center justify-center md:justify-end mt-6">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer w-full md:w-auto"
          >
            Eliminar mi cuenta permanentemente
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Settings;