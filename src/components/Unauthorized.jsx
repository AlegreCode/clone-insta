
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <ShieldAlert className="w-16 h-16 text-red-500" />
      <h1 className="mt-4 text-3xl font-bold text-gray-800">Acceso Denegado</h1>
      <p className="mt-2 text-gray-600">Debes iniciar sesión para ver esta página.</p>
      <Link to="/login" className="mt-6 px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default Unauthorized;
