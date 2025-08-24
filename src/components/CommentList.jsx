import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ comments, user, onDeleteComment }) => {
  return (
    <ul className="mt-4 space-y-2">
      {Array.isArray(comments) && comments.map((comment) => (
        <CommentItem 
          key={comment.id} 
          comment={comment} 
          user={user} 
          onDeleteComment={onDeleteComment} 
        />
      ))}
    </ul>
  );
};

export default CommentList;
