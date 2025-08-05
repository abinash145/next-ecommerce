"use client";
import { useEffect, useState } from "react";

import VariationTable from "@/components/page/seller/variations/VariationTable";

export default function ProductPage({ productId }: { productId: string }) {
  const [variations, setVariations] = useState([]);

  const fetchVariations = async () => {
    const res = await fetch(`/api/products/${productId}/variations`);
    const data = await res.json();
    setVariations(data);
  };

  useEffect(() => {
    fetchVariations();
  }, []);

  return (
    <VariationTable
      variations={variations}
      productId={productId}
      onRefresh={fetchVariations}
    />
  );
}
