
import React from 'react';
import { Loader as LoaderIcon } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <LoaderIcon className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="mt-4 text-lg text-gray-700">Cargando...</p>
    </div>
  );
};

export default Loader;
