
import React from 'react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MySwal = withReactContent(Swal);

const ProfilePostCard = ({ post, onDeletePost }) => {
  const handleDelete = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeletePost(post);
        toast.success('Post deleted successfully!');
      }
    });
  };

  return (
    <div key={post.id} className="relative overflow-hidden rounded-lg shadow-md group">
      <ToastContainer />
      <img
        src={post.imgurl}
        alt={`Post ${post.id}`}
        className="object-cover w-full h-full"
      />
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 cursor-pointer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProfilePostCard;
