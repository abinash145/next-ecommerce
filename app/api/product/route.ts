import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const postsPerPage = 5;
  const offset = (page - 1) * postsPerPage;

  // Fetch paginated posts
  const posts = await prisma.product.findMany({
    skip: offset,
    take: postsPerPage,
    orderBy: { createdAt: "desc" },
    include: {
      categories: {
        select: {
          category: true,
          product: true,
          id: true,
          categoryId: true,
          productId: true,
        },
      },
    },
  });

  const totalPosts = await prisma.post.count();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return NextResponse.json({ posts, totalPages });
}
