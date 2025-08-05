import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
const CategoryModal = ({
  id,
  fetchBrands,
  children,
}: {
  id?: string;
  fetchBrands: () => void;
  children?: React.ReactNode;
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!id) {
      try {
        const res = await fetch("/api/category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, logourl: logoPreview }),
        });

        if (res.ok) {
          toast.success("category created!");
          form.reset();
          setLogoPreview(null);
          fetchBrands();
        } else {
          toast.error("Failed to create brand.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong.");
      }
      return;
    }
    const res = await fetch(`/api/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, id, logoUrl: logoPreview }),
    });

    if (res.ok) {
      toast.success("category updated");
      fetchBrands();
    } else {
      toast.error("Failed to update brand");
    }
  };
  useEffect(() => {
    const fetchBrand = async () => {
      const res = await fetch(`/api/category/${id}`);
      if (res.ok) {
        const brand = await res.json();
        form.setValue("name", brand.name);
        setLogoPreview(brand.logoUrl || null);
      } else {
        toast.error("Failed to load brand");
      }
    };

    if (id) fetchBrand();
  }, [id, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant={"default"}>Add</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Category</DialogTitle>
          <DialogDescription>Category form</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="category" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="ml-auto" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
