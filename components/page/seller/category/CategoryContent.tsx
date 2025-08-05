"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Edit, Trash } from "lucide-react";

import Loading from "@/components/Loading";
import PaginationFooter from "@/components/table/TablePagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableState } from "@/hooks/use-table";

import CategoryModal from "./CategoryModal";

type Brand = {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
};

const CategoryContent = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    page,
    setPage,
    search,
    setSearch,
    setPerPage,
    perPage,
    totalCount,
    handlePaginationFromApi,
  } = useTableState();

  const fetchBrands = useCallback(async () => {
    const query = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      search: search,
    });
    const res = await fetch(`/api/category?${query}`);
    const { data, pagination } = await res.json();
    setBrands(data);
    handlePaginationFromApi(pagination);
  }, [handlePaginationFromApi, page, perPage, search]);

  useEffect(() => {
    fetchBrands();
  }, [page, perPage, search]);

  const handleDeleteBrand = async (id: string) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        alert("Category deleted successfully!");
        fetchBrands();
        // optionally, re-fetch the list or update state
      } else {
        alert("Failed to delete brand.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting brand");
    }
  };
  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Category List</h2>

            <CategoryModal fetchBrands={fetchBrands} />
          </div>
          <Card className="p-4">
            <div className="flex justify-end">
              <Input
                placeholder="Search"
                className="w-1/3"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            <Table className="border-collapse ">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="p-4">
                {brands &&
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>{brand.name}</TableCell>

                      <TableCell>
                        <div className="flex gap-4 items-center">
                          <CategoryModal
                            fetchBrands={fetchBrands}
                            id={brand.id}
                          >
                            <Edit />
                          </CategoryModal>{" "}
                          <Trash onClick={() => handleDeleteBrand(brand.id)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <PaginationFooter
              totalItems={totalCount}
              currentPage={Number(page || 1)}
              rowsPerPage={Number(perPage || 10)}
              onPageChange={setPage}
              onRowsPerPageChange={setPerPage}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default CategoryContent;
