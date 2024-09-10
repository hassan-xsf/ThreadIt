import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/ui/Navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThreadIt - A Reddit Clone",
  description: "ThreadIt is a Reddit clone built with NextJS + NextAuth + Prisma + React Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} text-black dark:text-white bg-white dark:bg-primary-black`} suppressHydrationWarning>
        <Providers>
          <main>
            <Navbar />
            <div className="flex-1 pt-16 p-6">
              {children}
            </div>
          </main>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html >
  );
}
