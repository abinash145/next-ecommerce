// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Brand ID is required" },
      { status: 400 }
    );
  }

  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        products: true,
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
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
      { error: "Brand ID is required" },
      { status: 400 }
    );
  }

  try {
    const { name, logoUrl } = await request.json();

    // Check if the brand with the given ID exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        { error: "Brand does not exist with this ID." },
        { status: 404 }
      );
    }

    // Optional: Prevent duplicate names
    if (name && name !== existingBrand.name) {
      const duplicate = await prisma.brand.findFirst({ where: { name } });
      if (duplicate) {
        return NextResponse.json(
          { error: "Brand name already exists." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.brand.update({
      where: { id },
      data: {
        name: name ?? existingBrand.name,
        logoUrl: logoUrl ?? existingBrand.logoUrl,
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Brand update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
