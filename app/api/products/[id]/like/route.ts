import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // Ensure params is properly awaited here.
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { likes: { increment: 1 } }, // Increment likes by 1
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ error: "Failed to update likes" }, { status: 500 });
  }
}
