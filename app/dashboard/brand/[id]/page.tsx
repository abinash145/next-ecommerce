"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BrandFormData = {
  name: string;
  logoUrl?: string;
};

export default function BrandEditPage() {
  const { id } = useParams();
  const { register, handleSubmit, setValue } = useForm<BrandFormData>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBrand = async () => {
      const res = await fetch(`/api/brand/${id}`);
      if (res.ok) {
        const brand = await res.json();
        setValue("name", brand.name);
        setLogoPreview(brand.logoUrl || null);
      } else {
        toast.error("Failed to load brand");
      }
    };

    if (id) fetchBrand();
  }, [id, setValue]);

  const onSubmit = async (data: BrandFormData) => {
    const res = await fetch(`/api/brand/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id, logoUrl: logoPreview }),
    });

    if (res.ok) {
      toast.success("Brand updated");
      router.push("/dashboard/brand"); // or navigate to detail
    } else {
      toast.error("Failed to update brand");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      const base64 = reader.result;

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await uploadRes.json();
      if (data.url) {
        setLogoPreview(data.url);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="space-y-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input id="name" {...register("name", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo (optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
            {logoPreview && (
              <Image
                src={logoPreview}
                alt="Brand logo"
                className="w-24 h-24 object-contain mt-2 border rounded"
                width={96}
                height={96}
              />
            )}
          </div>

          <Button type="submit" className="w-full mt-4">
            Update Brand
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
