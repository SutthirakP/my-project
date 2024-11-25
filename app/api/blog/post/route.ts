import { NextRequest, NextResponse } from 'next/server';

let posts = [
  { id: '1', title: "Latest Trend In Business", date: "June 30, 2021", content: "Lorem ipsum dolor sit amet..." },
  // more posts...
];

// Handle GET request
export async function GET(req: NextRequest) {
  return NextResponse.json(posts);
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPost = {
      id: Date.now().toString(), // Generate ID (for demo purposes)
      ...body,
    };
    posts.push(newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating post" }, { status: 500 });
  }
}

// Handle PUT request
export async function PUT(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('id');
    const updatedData = await req.json();

    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    posts[postIndex] = { ...posts[postIndex], ...updatedData };
    return NextResponse.json(posts[postIndex]);
  } catch (error) {
    return NextResponse.json({ message: "Error updating post" }, { status: 500 });
  }
}

// Handle DELETE request
export async function DELETE(req: NextRequest) {
  try {
    const postId = req.nextUrl.searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const deletedPost = posts.splice(postIndex, 1);
    return NextResponse.json(deletedPost[0]);
  } catch (error) {
    return NextResponse.json({ message: "Error deleting post" }, { status: 500 });
  }
}
