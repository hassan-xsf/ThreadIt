import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next App with PostgreSQL with Prisma + NextAuth",
  description: "Generated by create next app, Includes prisma, postgreSQL with authentication!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="max-w-screen-2xl mx-auto px-4">
            <Navbar />
            {children}
          </main>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html >
  );
}
