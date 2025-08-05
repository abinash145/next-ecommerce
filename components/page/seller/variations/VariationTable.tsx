"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import VariationForm from "./VariatonsForm";

export type VariationType = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

export default function VariationTable({
  variations,
  productId,
  onRefresh,
}: {
  variations: VariationType[];
  productId: string;
  onRefresh: () => void;
}) {
  const [selectedVariation, setSelectedVariation] =
    useState<VariationType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this variation?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/variations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Variation deleted");
      onRefresh();
    } catch (error) {
      toast.error("Error deleting variation");
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Product Variations</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedVariation(null)}>
              + Add Variation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <VariationForm
              productId={productId}
              initialData={selectedVariation || undefined}
              onSuccess={() => {
                onRefresh();
                setDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variations.length > 0 ? (
            variations.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.size}</TableCell>
                <TableCell>{v.color}</TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedVariation(v);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(v.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No variations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
