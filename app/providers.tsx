"use client";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {" "}
      <NuqsAdapter>{children}</NuqsAdapter>
    </SessionProvider>
  );
}
