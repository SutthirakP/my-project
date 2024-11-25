// action/blog/deletePost.ts
export async function deletePost(postId: string) {
    const response = await fetch(`/api/blog/post/${postId}`, {
      method: 'DELETE',
    });
  
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
  
    return response.json();
  }
  