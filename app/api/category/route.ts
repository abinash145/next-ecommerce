import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { withPagination } from "@/lib/utils/api/withPagination";

export const GET = (req: NextRequest) => {
  console.log("quam req", req);
  return withPagination({
    model: prisma.category,
    searchField: "name",
    select: {
      id: true,
      name: true,
    },
    req,
    orderBy: { name: "desc" },
  });
};

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name  are required." },
        { status: 400 }
      );
    }
    const existingBrand = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: "Category already exists with this name." },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    //respone handler
    // error handler
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
