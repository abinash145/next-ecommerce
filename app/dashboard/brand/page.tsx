"use client";

import { useEffect, useState } from "react";

import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Brand = {
  id: string;
  name: string;
  logoUrl?: string;
  createdAt: string;
};

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const res = await fetch(`/api/brand?page=${page}`);
      const data = await res.json();
      setBrands(data.brands);
      setTotalPages(data.totalPages);
      setLoading(false);
    };

    fetchBrands();
  }, [page]);

  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Brand List</h2>
        <Link href="/dashboard/brand/add">Add</Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Edit</TableHead>
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
                  <Link href={`/dashboard/brand/${brand.id}`}>
                    <Edit />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
