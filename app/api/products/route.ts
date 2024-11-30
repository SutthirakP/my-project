import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define Zod schema for product validation
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url('Image URL must be valid'),
  likes: z.number().int().nonnegative('Likes must be non-negative'),
  isNew: z.boolean().optional().default(true),
  brand: z.string().min(1, 'Brand is required'), // เพิ่มการตรวจสอบ brand
  scale: z.string().min(1, 'Scale is required'), // เพิ่มการตรวจสอบ scale
});

// Handle POST and GET requests
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '0', 10);

    const products = await prisma.product.findMany({
      take: limit > 0 ? limit : undefined, // ใช้ limit ถ้าระบุ
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        likes: true,
        isNew: true,
        category: true,
        brand: true,
        scale: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}