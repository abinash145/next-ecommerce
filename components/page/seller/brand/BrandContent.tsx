"use client";
import React, { useCallback, useEffect, useState } from "react";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";

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

import BrandModal from "./BrandModal";

type Brand = {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
};

const BrandContent = () => {
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
    const res = await fetch(`/api/brand?${query}`);
    const { data, pagination } = await res.json();
    setBrands(data);
    handlePaginationFromApi(pagination);
  }, [handlePaginationFromApi, page, perPage, search]);

  useEffect(() => {
    fetchBrands();
  }, [page, perPage, search]);

  const handleDeleteBrand = async (id: string) => {
    try {
      const res = await fetch(`/api/brand/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        alert("Brand deleted successfully!");
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
            <h2 className="text-xl font-semibold">Brand List</h2>

            <BrandModal fetchBrands={fetchBrands} />
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
                  <TableHead>Logo</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="p-4">
                {brands &&
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>{brand.name}</TableCell>
                      <TableCell>
                        {brand.logoUrl ? (
                          <Image
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-16 h-16 object-contain border rounded"
                            height={100}
                            width={100}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground italic">
                            No Logo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(brand.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-4 items-center">
                          <BrandModal fetchBrands={fetchBrands} id={brand.id}>
                            <Edit />
                          </BrandModal>{" "}
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

export default BrandContent;
