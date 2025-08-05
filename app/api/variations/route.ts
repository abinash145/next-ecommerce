import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// app/api/variations/route.ts

export async function POST(req: Request) {
  try {
    const { productId, size, color, stock } = await req.json();

    const variation = await prisma.variation.create({
      data: {
        productId,
        size,
        color,
        stock,
      },
    });

    return NextResponse.json(variation, { status: 201 });
  } catch (error) {
    console.error("Error creating variation:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const variations = await prisma.variation.findMany({
      include: {
        product: true,
      },
    });

    return NextResponse.json(variations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
