// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /user/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const { name } = await request.json();

    // Check if the category with the given ID exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category does not exist with this ID." },
        { status: 404 }
      );
    }

    // Optional: Prevent duplicate names
    if (name && name !== existingCategory.name) {
      const duplicate = await prisma.category.findFirst({ where: { name } });
      if (duplicate) {
        return NextResponse.json(
          { error: "Category name already exists." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? existingCategory.name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deletedCategory });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, message: "Category not found or error deleting" },
      { status: 500 }
    );
  }
}
