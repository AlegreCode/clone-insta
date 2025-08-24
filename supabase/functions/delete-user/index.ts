import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// This function extracts the path from a Supabase storage URL (both public and signed)
const getPathFromUrl = (url: string, bucketName: string): string | null => {
  const signedUrlPath = `/storage/v1/object/sign/${bucketName}/`;
  const publicUrlPath = `/storage/v1/object/public/${bucketName}/`;
  
  let path: string | null = null;
  
  if (typeof url !== 'string') {
    return null;
  }

  if (url.includes(signedUrlPath)) {
    const pathIndex = url.indexOf(signedUrlPath);
    const urlWithoutToken = url.split('?')[0];
    path = urlWithoutToken.substring(pathIndex + signedUrlPath.length);
  } else if (url.includes(publicUrlPath)) {
    const pathIndex = url.indexOf(publicUrlPath);
    path = url.substring(pathIndex + publicUrlPath.length);
  }
  
  return path;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create a client with the user's auth token to get the user ID
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await userSupabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Authentication failed.');
    }

    // Create an admin client to perform privileged operations
    const adminSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch user profile from public.users to get the user's ID and avatar
    const { data: userProfile, error: profileError } = await adminSupabaseClient
      .from('users')
      .select('id, avatar')
      .eq('user_id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // Ignore "No rows found" error
      throw new Error(`Error fetching user profile: ${profileError.message}`);
    }

    let userPosts: { imgurl: string }[] = [];
    if (userProfile) {
      // If a user profile exists, fetch their posts using the public.users ID
      const { data: posts, error: postsError } = await adminSupabaseClient
        .from('posts')
        .select('imgurl')
        .eq('user_id', userProfile.id);

      if (postsError) {
        throw new Error(`Error fetching user posts: ${postsError.message}`);
      }
      if (posts) {
        userPosts = posts;
      }
    }

    // --- Delete Avatar ---
    const avatarPath = userProfile?.avatar ? getPathFromUrl(userProfile.avatar, 'avatars') : null;
    if (avatarPath) {
      const { error: avatarError } = await adminSupabaseClient.storage.from('avatars').remove([avatarPath]);
      if (avatarError) {
        console.error(`Failed to delete avatar for user ${user.id}: ${avatarError.message}`);
        // We can choose to throw here to stop the process, or just log the error and continue
        // For now, let's throw to ensure atomicity
        throw new Error(`Failed to delete avatar: ${avatarError.message}`);
      }
    }

    // --- Delete Post Images ---
    if (userPosts && userPosts.length > 0) {
      const postPaths = userPosts
        .map(post => getPathFromUrl(post.imgurl, 'posts'))
        .filter((path): path is string => path !== null);
      
      if (postPaths.length > 0) {
        const { error: postsError } = await adminSupabaseClient.storage.from('posts').remove(postPaths);
        if (postsError) {
          console.error(`Failed to delete post images for user ${user.id}: ${postsError.message}`);
          throw new Error(`Failed to delete post images: ${postsError.message}`);
        }
      }
    }

    // --- Delete User from Auth ---
    // This will cascade and delete from public.users, posts, comments, likes
    const { error: deleteError } = await adminSupabaseClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw new Error(`Failed to delete user: ${deleteError.message}`);
    }

    return new Response(JSON.stringify({ message: 'Account and associated files deleted successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in delete-user function:', error.message);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
