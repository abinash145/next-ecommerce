"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { assets } from "@/assets/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FormValues = {
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  brandId: string;
  images: string;
  categoryIds: string[];
};

export default function ProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      brandId: "",
      images: "",
      categoryIds: [],
    },
  });

  const fetchBrands = useCallback(async () => {
    const res = await fetch(`/api/brand?page=1&perPage=100`);
    const { data } = await res.json();
    setBrands(
      (data ?? []).map((item: any) => ({ value: item.id, label: item.name }))
    );
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`/api/category?page=1&perPage=100`);
    const { data } = await res.json();
    setCategories(
      (data ?? []).map((item: any) => ({ value: item.id, label: item.name }))
    );
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      // Convert all files to base64
      const base64Files = await Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            if (typeof file === "string") return;
            reader.readAsDataURL(file);
          });
        })
      );

      // Upload all base64 files and get URLs
      const imageUrls = await Promise.all(
        base64Files.map(async (base64, index) => {
          try {
            const res = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ file: base64 }),
            });

            const result = await res.json();
            if (!res.ok || !result.url) throw new Error("Upload failed");

            toast.success(`Image ${index + 1} uploaded`);
            return result.url;
          } catch (err) {
            toast.error(`Failed to upload image ${index + 1}`);
            throw err;
          }
        })
      );

      // Submit product
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          offerPrice: parseFloat(data.offerPrice),
          images: imageUrls,
        }),
      });

      if (res.ok) {
        toast.success("Product created successfully!");
        router.refresh();
        reset();
      } else {
        toast.error("Failed to create product");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong while uploading or submitting");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-xl mx-auto"
    >
      <div>
        <Label>Name</Label>
        <Input {...register("name", { required: true })} />
        {errors.name && <span className="text-red-500">Name is required</span>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input type="number" {...register("price", { required: true })} />
          {errors.price && (
            <span className="text-red-500">Price is required</span>
          )}
        </div>
        <div>
          <Label>Offer Price</Label>
          <Input type="number" {...register("offerPrice")} />
        </div>
      </div>

      <div>
        <Label>Brand</Label>
        <Controller
          name="brandId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Brand</SelectLabel>
                  {brands.map((brand) => (
                    <SelectItem value={brand.value} key={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label>Categories</Label>
        <Controller
          control={control}
          name="categoryIds"
          render={({ field }) => (
            <MultiSelect
              options={categories}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder="Select categories"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
          )}
        />
      </div>

      <div>
        <p className="text-base font-medium">Product Image</p>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {[...Array(4)].map((_, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <input
                type="file"
                id={`image${index}`}
                hidden
                accept="image/*"
                onChange={(e) => {
                  const updated = [...files];
                  updated[index] = e.target.files?.[0];
                  setFiles(updated);
                }}
              />
              <Image
                className="max-w-24 cursor-pointer"
                src={
                  files[index]
                    ? typeof files[index] === "string"
                      ? files[index]
                      : URL.createObjectURL(files[index])
                    : assets.upload_area
                }
                alt={`upload-${index}`}
                width={100}
                height={100}
              />
            </label>
          ))}
        </div>
      </div>
      <Select onValueChange={setSize}>
        <SelectTrigger>
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {["S", "M", "L", "XL"].map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Add Product
      </Button>
    </form>
  );
}
