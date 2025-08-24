import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { getCommentsByPostId, addComment, deleteComment } from "../services/supabaseService";
import { toast } from "react-toastify";

const Comments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getCommentsByPostId(postId);
      if (commentsData) {
        setComments(commentsData);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleCommentSubmit = async (data) => {
    if (!user) {
        toast.error("You must be logged in to comment.");
        return;
    }
    try {
      const newComment = await addComment(data.comment, postId, user.id);
      if (newComment) {
        setComments([newComment, ...comments]);
        toast.success("Comment added successfully!");
      } else {
        throw new Error("addComment returned undefined");
      }
    } catch (error) {
      console.error("Error in handleCommentSubmit:", error);
      toast.error("Error adding comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Error deleting comment.");
    }
  };

  return (
    <div>
      <CommentList comments={comments} user={user} onDeleteComment={handleDeleteComment} />
      <CommentForm onCommentSubmit={handleCommentSubmit} />
    </div>
  );
};

export default Comments;