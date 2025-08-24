import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleLike, getLikesByPostId, getUserData } from '../services/supabaseService';

const LikeButton = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLike = async () => {
            try {
                const userData = await getUserData();
                setUser(userData);

                const { likes, count } = await getLikesByPostId(post.id);
                setLikesCount(count);

                if (userData) {
                    const userLiked = likes.some((like) => like.user_id === userData.id);
                    setLiked(userLiked);
                }
            } catch (error) {
                console.error('Error checking like:', error);
            } finally {
                setLoading(false);
            }
        };

        checkLike();
    }, [post.id]);

    const handleLike = async () => {
        if (!user) {
            alert('Debes iniciar sesión para dar me gusta');
            return;
        }

        try {
            setLiked(!liked);
            setLikesCount(liked ? likesCount - 1 : likesCount + 1);
            await toggleLike(post.id, user.id);
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert state on error
            setLiked(!liked);
            setLikesCount(liked ? likesCount + 1 : likesCount - 1);
        }
    };

    if (loading) {
        return null;
    }

    return (
        <div className="flex items-center">
            <motion.div
                onClick={handleLike}
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: liked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                <Heart
                    size={32}
                    className={`transition-colors duration-300 ${
                        liked 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                />
            </motion.div>
            <span className="ml-2 text-gray-600">A {likesCount} personas les gusta</span>
        </div>
    );
};

export default LikeButton;