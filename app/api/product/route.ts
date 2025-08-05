import { NextResponse } from "next/server";

import prisma from "@/lib/prisma"; // Update import based on your setup

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      price,
      offerPrice,
      images,
      brandId,
      categoryIds,
      variations,
    } = await req.json();

    // 1. Create Product with optional brand and variations
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        offerPrice,
        images,
        brand: brandId ? { connect: { id: brandId } } : undefined,
        variations: {
          create: variations || [],
        },
      },
    });

    // 2. Create ProductCategory entries
    if (categoryIds && categoryIds.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          productId: product.id,
          categoryId,
        })),
      });
    }
    // 3. Refetch full product with related data
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Read all products and join ProductCategory → Category
    const products = await prisma.product.findMany();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
