// action/blog/updatePost.ts
export async function updatePost(postId: string, updatedData: any) {
    const response = await fetch(`/api/blog/post/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
  
    return response.json();
  }
  