import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const postsPerPage = 5;
  const offset = (page - 1) * postsPerPage;

  // Fetch paginated posts
  const brands = await prisma.brand.findMany({
    skip: offset,
    take: postsPerPage,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      logoUrl: true,
    },
  });

  const totalPosts = await prisma.brand.count();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return NextResponse.json({ brands, totalPages });
}

export async function POST(request: Request) {
  try {
    const { name, logoUrl } = await request.json();

    if (!name || !logoUrl) {
      return NextResponse.json(
        { error: "Name and Logo Url are required." },
        { status: 400 }
      );
    }
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name,
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Brand already exists with this name." },
        { status: 400 }
      );
    }

    const newBrand = await prisma.brand.create({
      data: {
        name: name,
        logoUrl,
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Brand creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
