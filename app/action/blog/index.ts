// action/blog/index.ts

export async function getPosts() {
    // ฟังก์ชันสำหรับดึงข้อมูลโพสต์ทั้งหมด
    const response = await fetch('/api/blog/posts', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }
  
  export async function createPost(data: { title: string; date: string; content: string }) {
    // ฟังก์ชันสำหรับสร้างโพสต์ใหม่
    const response = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  }
  
  export async function updatePost(id: string, data: { title: string; date: string; content: string }) {
    // ฟังก์ชันสำหรับอัปเดตโพสต์
    const response = await fetch(`/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    return response.json();
  }
  
  export async function deletePost(id: string) {
    // ฟังก์ชันสำหรับลบโพสต์
    const response = await fetch(`/api/blog/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete post');
    }
    return response.json();
  }
  