import { Prisma } from "@prisma/client";

interface PaginateOptions<T> {
  model: {
    findMany: (args: unknown) => Promise<T[]>;
    count: (args: unknown) => Promise<number>;
  };
  searchField?: string;
  where?: Prisma.BrandWhereInput; // or generalize to Prisma.Prisma__ModelNameClientInput
  select?: unknown;
  orderBy?: unknown;
  url: string;
}

export async function paginateAndSearch<T>({
  model,
  searchField = "name",
  where = {},
  select,
  orderBy = { createdAt: "desc" },
  url: propUrl,
}: PaginateOptions<T>) {
  const url = new URL(propUrl);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "5", 10);
  const search = url.searchParams.get("search") || "";
  const offset = (page - 1) * perPage;

  const searchCondition =
    search.trim() && searchField
      ? {
          [searchField]: {
            contains: search.trim(),
            mode: "insensitive",
          },
        }
      : {};

  const finalWhere = {
    ...where,
    ...searchCondition,
  };

  const [data, totalCount] = await Promise.all([
    model.findMany({
      skip: offset,
      take: perPage,
      where: finalWhere,
      select,
      orderBy,
    }),
    model.count({ where: finalWhere }),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      perPage,
    },
  };
}
