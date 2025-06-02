"use client";
import { useState } from "react";

import Image from "next/image";

export default function BrandLogoUpload() {
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setLoading(true);
      const base64 = reader.result;

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      });

      const data = await res.json();
      console.log("data handle upload", data);
      setLogo(data.url);
      setLoading(false);
    };
    reader.readAsDataURL(file); // convert to base64
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Uploading...</p>}
      {logo && <Image src={logo} alt="Brand Logo" width={200} height={200} />}
    </div>
  );
}
