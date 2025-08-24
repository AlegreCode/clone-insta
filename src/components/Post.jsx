
import React from 'react';
import LikeButton from './LikeButton';
import Comments from './Comments';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Post = ({ post, user }) => {
  return (
    <div key={post.id} className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img
          src={post.users.avatar}
          alt={post.users.username}
          className="w-10 h-10 mr-4 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{post.users.username}</h3>
          <p className="text-sm text-gray-500">{dayjs(post.created_at).fromNow()}</p>
        </div>
      </div>
      <img
        src={post.imgurl}
        alt={`Post de ${post.users.username}`}
        className="w-full mb-4 rounded-lg"
      />
      <p className="mb-4 text-gray-700">{post.description}</p>
      <LikeButton post={post} />
      <Comments postId={post.id} user={user} />
    </div>
  );
};

export default Post;
