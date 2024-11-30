import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  
  if (
    !params.id ||
    !body.name ||
    !body.price ||
    !body.imageUrl ||
    body.likes === undefined ||
    !body.brand || // ตรวจสอบ brand
    !body.scale // ตรวจสอบ scale
  ) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: Number(params.id) },
    data: {
      name: body.name,
      price: body.price,
      imageUrl: body.imageUrl,
      likes: body.likes,
      brand: body.brand, // เพิ่ม brand
      scale: body.scale, // เพิ่ม scale
    },
  });

  return NextResponse.json(updatedProduct);
}
  

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
