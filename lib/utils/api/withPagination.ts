import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

interface WithPaginationOptions<T> {
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  };
  searchField?: string;
  defaultWhere?: Prisma.BrandWhereInput | Record<string, any>;
  select?: any;
  orderBy?: any;
  req: NextRequest;
}

export async function withPagination<T>(options: WithPaginationOptions<T>) {
  const {
    model,
    searchField = "name",
    defaultWhere = {},
    select,
    orderBy = { createdAt: "desc" },
    req,
  } = options;

  const url = new URL(req.url);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const perPage = Math.max(
    parseInt(url.searchParams.get("perPage") || "1", 10),
    1
  );
  const search = url.searchParams.get("search")?.trim() || "";
  const offset = (page - 1) * perPage;

  const searchCondition =
    search && searchField
      ? {
          [searchField]: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

  const where = {
    ...defaultWhere,
    ...searchCondition,
  };

  const [data, totalCount] = await Promise.all([
    model.findMany({
      skip: offset,
      take: perPage,
      where,
      select,
      orderBy,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return NextResponse.json({
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      perPage,
    },
  });
}
