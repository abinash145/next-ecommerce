// app/layout.tsx
import "./globals.css";

import { Toaster } from "react-hot-toast";

import { AppContextProvider } from "@/context/AppContext";

import Providers from "./providers";

export const metadata = {
  title: "E App",
  description: "A blog app using Next.js and Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* <Header /> */}

            <Toaster />
            <AppContextProvider>
              <main className="flex-1">{children}</main>
            </AppContextProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
