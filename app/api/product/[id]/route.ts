import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title, description, price, images, brandId, categoryIds } =
    await req.json();

  const updatedProduct = await prisma.product.update({
    where: { id: params.id },
    data: {
      title,
      description,
      price,
      images,
      brandId,
      // Remove old links and recreate them
      categories: {
        deleteMany: {},
        create: categoryIds.map((id: string) => ({
          category: { connect: { id } },
        })),
      },
    },
    include: {
      categories: { include: { category: true } },
    },
  });

  return NextResponse.json(updatedProduct);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
