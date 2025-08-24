import supabase from '../utils/supabase';

export const register = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
      }
    }
  });
  if (error) throw error;
  return data;
};

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const getUserData = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const publicData = { ...data, email: user.email, auth_user_id: user.id };
  return publicData;
};

export const getPostsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error getting posts by user id:', error);
        return [];
    }

    return data;
};

export const completeUserProfile = async (firstname, lastname, bio, avatar) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  // Función helper para extraer el path del archivo desde una signed URL
  const extractFilePathFromUrl = (signedUrl) => {
    try {
      const url = new URL(signedUrl);
      // Diferentes patrones posibles para signed URLs de Supabase
      let pathMatch = url.pathname.match(/\/storage\/v1\/object\/sign\/avatars\/(.+)$/);
      
      if (!pathMatch) {
        // Intentar con otro patrón común
        pathMatch = url.pathname.match(/\/storage\/v1\/object\/avatars\/(.+)$/);
      }
      
      if (!pathMatch) {
        // Patrón más general
        pathMatch = url.pathname.match(/avatars\/(.+)$/);
      }
      
      const filePath = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
      console.log('Signed URL:', signedUrl);
      console.log('Extracted file path:', filePath);
      
      return filePath;
    } catch (error) {
      console.error('Error extracting file path:', error);
      return null;
    }
  };

  // Obtener el perfil existente (incluyendo el avatar actual si existe)
  const { data: existingProfile, error: selectError } = await supabase
    .from('users')
    .select('id, avatar')
    .eq('user_id', user.id)
    .maybeSingle();

  if (selectError) throw selectError;

  let avatarUrl = null;
  
  if (avatar) {
    // Si hay un perfil existente con avatar, eliminar la imagen anterior
    if (existingProfile?.avatar) {
      const oldFilePath = extractFilePathFromUrl(existingProfile.avatar);
      if (oldFilePath) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([oldFilePath]);
        
        if (deleteError) {
          console.error('Error deleting old avatar:', deleteError);
          // No lanzamos el error aquí para no interrumpir el flujo
          // pero podrías decidir lanzarlo si es crítico
        }
      }
    }

    // Subir la nueva imagen
    const filePath = `${user.id}/${Date.now()}_${avatar.name}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatar, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Crear signed URL para la nueva imagen
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 315360000); // 10 years

    if (error) throw error;

    avatarUrl = data.signedUrl;
  }

  const profileData = {
    firstname,
    lastname,
    bio,
    username: user.user_metadata.display_name,
    user_id: user.id,
    ...(avatarUrl && { avatar: avatarUrl }),
  };

  if (existingProfile) {
    const { data, error } = await supabase
      .from('users')
      .update(profileData)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('users')
      .insert(profileData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const getAllPostsWithUser = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (
        id,
        username,
        avatar
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
    return null;
  }
  
  if (!data || !data.length) {
    return [];
  }
  
  return data;
};

export const uploadPost = async (description, imageFile, userId, authId) => {
  const filePath = `${userId}/${Date.now()}_${imageFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from('posts')
    .upload(filePath, imageFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData, error: urlError } = await supabase.storage
    .from('posts')
    .createSignedUrl(filePath, 315360000); // 10 years

  if (urlError) throw urlError;

  const postData = {
    description,
    imgurl: urlData.signedUrl,
    user_id: authId,
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCommentsByPostId = async (post_id) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, users(*)')
    .eq('post_id', post_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return null;
  }

  if (!data || !data.length) {
    return [];
  }

  return data;
};

export const addComment = async (comment, post_id, user_id) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      { comment, post_id, user_id },
    ])
    .select('*, users(*)')

  if (error) {
    console.error('Error:', error);
    throw error;
  }

  return data[0];
};

export const getLikesByPostId = async (post_id) => {
    const { data, error, count } = await supabase
        .from('likes')
        .select('*', { count: 'exact' })
        .eq('post_id', post_id);

    if (error) {
        console.error('Error getting likes:', error);
        return { likes: [], count: 0 };
    }

    return { likes: data, count };
};

export const toggleLike = async (post_id, user_id) => {
    const { data: existingLike, error: selectError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post_id)
        .eq('user_id', user_id)
        .maybeSingle();

    if (selectError) throw selectError;

    if (existingLike) {
        const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id);

        if (deleteError) throw deleteError;
        return { liked: false };
    } else {
        const { data, error: insertError } = await supabase
            .from('likes')
            .insert({ post_id, user_id })
            .select()
            .single();

        if (insertError) throw insertError;
        return { liked: true, like: data };
    }
};

export const deleteComment = async (commentId) => {
  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }

  return data;
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

export const forgotPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: import.meta.env.VITE_REDIRECT_URL,
  });
  if (error) throw error;
  return data;
};

export const deletePost = async (post) => {
  try {
    // 1. Extract file path from imgurl
    const url = new URL(post.imgurl);
    const pathSegments = url.pathname.split('/');
    const postsIndex = pathSegments.indexOf('posts');
    if (postsIndex === -1 || postsIndex + 1 >= pathSegments.length) {
      throw new Error('Could not determine file path from imgurl');
    }
    const filePath = pathSegments.slice(postsIndex + 1).join('/');

    // 2. Delete image from storage
    const { error: storageError } = await supabase.storage.from('posts').remove([filePath]);
    if (storageError) {
      console.warn('Could not delete post image from storage:', storageError.message);
    }

    // 3. Delete post from database (assuming cascading delete for comments and likes)
    const { error: dbError } = await supabase.from('posts').delete().eq('id', post.id);
    if (dbError) {
      console.error('Error deleting post from database:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
};

export const deleteCurrentUserAccount = async () => {
  const { data, error } = await supabase.functions.invoke('delete-user');

  if (error) {
    console.error('Error al eliminar la cuenta:', error.message);
    throw new Error(`Error al eliminar la cuenta: ${error.message}`);
  }

  // Después de que la función del servidor elimina al usuario, el token de sesión
  // actual ya no es válido, por lo que signOut() fallará en el lado del servidor.
  // Sin embargo, todavía queremos llamar a signOut() para limpiar la sesión del
  // almacenamiento local del navegador. Ignoramos el error esperado.
  await supabase.auth.signOut().catch(error => {
    // Se espera un error aquí porque el usuario ya no existe en la base de datos.
    // Lo importante es que la sesión local se limpie.
    console.warn('Error esperado durante el signOut después de eliminar la cuenta:', error.message);
  });

  return data;
};
