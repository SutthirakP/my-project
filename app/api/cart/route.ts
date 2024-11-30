import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if product is already in the cart
    const existingCartItem = await prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (existingCartItem) {
      // If already in the cart, increment quantity
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: 1 } },
      });

      return NextResponse.json(updatedCartItem, { status: 200 });
    } else {
      // Add new product to cart
      const newCartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });

      return NextResponse.json(newCartItem, { status: 201 });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
