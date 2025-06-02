"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Optional, for feedback

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BrandFormValues = {
  name: string;
  logoUrl?: string;
};

export default function BrandForm() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<BrandFormValues>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data: BrandFormValues) => {
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Brand created!");
        reset();
        setLogoPreview(null);
        router.push("/dashboard/brand");
      } else {
        toast.error("Failed to create brand.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
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
        <form
          onSubmit={handleSubmit((values) =>
            onSubmit({ ...values, logoUrl: logoPreview || undefined })
          )}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="e.g. Nike"
            />
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
                alt="Logo preview"
                className="w-24 h-24 object-contain mt-2"
                width={96}
                height={96}
              />
            )}
          </div>

          <Button type="submit" className="w-full mt-4" disabled={uploading}>
            Create Brand
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
