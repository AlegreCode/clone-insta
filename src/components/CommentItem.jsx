import React from 'react';
import { Trash2 } from 'lucide-react';

const CommentItem = ({ comment, user, onDeleteComment }) => {
  return (
    <li key={comment.id} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
      <div className="flex items-center">
        <img src={comment.users.avatar || `https://placehold.co/150x150/E0F2FE/0EA5E9/png?text=${comment.users.username?.charAt(0).toUpperCase() || 'U'}`} alt={comment.users.username} className="w-8 h-8 rounded-full mr-2" />
        <div>
          <strong className="mr-2">{comment.users.username}</strong>
          <span>{comment.comment}</span>
        </div>
      </div>
      {user && user.id === comment.user_id && (
        <button onClick={() => onDeleteComment(comment.id)} className="text-gray-500 hover:text-red-500 cursor-pointer">
          <Trash2 size={20} />
        </button>
      )}
    </li>
  );
};

export default CommentItem;