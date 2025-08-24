import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Send, Loader as LoaderIcon } from 'lucide-react';

const UploadPost = ({ onUpload }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [preview, setPreview] = useState('https://placehold.co/600x400');
  const { onChange: onImageChange, ...imageRegister } = register('image', { required: 'La imagen es requerida' });

  const onSubmit = async (data) => {
    await onUpload(data);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="p-4 mb-8 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-xl font-bold">Subir Publicación</h3>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
        <div>
          <label htmlFor="image" className="text-sm font-medium text-gray-700">
            Imagen
          </label>
          <div className="flex items-center mt-1">
            <img src={preview} alt="Previsualización" className="w-32 h-32 mr-4 rounded-md" />
            <label
              htmlFor="image"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-700"
            >
              <Image className="mr-2" size={18} />
              Seleccionar Imagen
              <input
                id="image"
                type="file"
                accept="image/*"
                {...imageRegister}
                className="hidden"
                onChange={(e) => {
                  onImageChange(e);
                  handleImageChange(e);
                }}
              />
            </label>
          </div>
          {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            {...register('description', { required: 'La descripción es requerida' })}
            className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Publicar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPost;