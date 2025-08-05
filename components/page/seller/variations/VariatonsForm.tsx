"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function VariationForm({
  productId,
  initialData,
  onSuccess,
}: {
  productId: string;
  initialData?: {
    id: string;
    size: string;
    color: string;
    stock: number;
  };
  onSuccess?: () => void;
}) {
  const [size, setSize] = useState(initialData?.size || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialData?.id);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      size,
      color,
      stock: parseInt(stock),
      productId,
    };

    try {
      const res = await fetch(
        `/api/variations${isEdit ? `/${initialData?.id}` : ""}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed");

      toast.success(isEdit ? "Variation updated" : "Variation created");
      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Size</Label>
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Color</Label>
        <Input
          placeholder="e.g. Black, Red"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div>
        <Label>Stock</Label>
        <Input
          type="number"
          placeholder="e.g. 10"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {isEdit ? "Update Variation" : "Create Variation"}
      </Button>
    </div>
  );
}
