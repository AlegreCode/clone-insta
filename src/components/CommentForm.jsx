import React from "react";
import { useForm } from "react-hook-form";
import { Send } from 'lucide-react';

const CommentForm = ({ onCommentSubmit }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    onCommentSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center mt-4">
      <input
        type="text"
        placeholder="Add a comment..."
        {...register("comment", { required: true })}
        className="w-full p-2 mr-2 border rounded-lg"
      />
      <button
        type="submit"
        className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 cursor-pointer"
      >
        <Send className="mr-2" size={18} />
        Enviar
      </button>
    </form>
  );
};

export default CommentForm;
