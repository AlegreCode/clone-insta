import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center text-gray-800 bg-gray-50">
      <AlertTriangle className="w-24 h-24 mb-6 text-red-500" />
      <h1 className="mb-2 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página No Encontrada</h2>
      <p className="mb-8 text-gray-600">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;
