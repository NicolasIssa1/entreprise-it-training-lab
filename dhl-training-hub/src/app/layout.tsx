import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/Nav";
import { MigrationBanner } from "@/components/MigrationBanner";
import { PageTransition } from "@/components/PageTransition";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { displayProductName, product } from "@/lib/product";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: displayProductName,
  description: `${product.subtitle} ${product.trainingDisclaimer}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AuthProvider>
          <div className="print:hidden">
            <Nav />
            <MigrationBanner />
          </div>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="print:hidden border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
            {product.trainingDisclaimer}{" "}
            <Link href="/privacy" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              Privacy &amp; Data Safety
            </Link>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
