// action/blog/createPost.ts
export async function createPost(postData: any) {
    const response = await fetch('/api/blog/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
  
    return response.json();
  }
  