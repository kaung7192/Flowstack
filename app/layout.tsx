import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Flowstack",
  description: "Tools to help you switch smarter and manage your money with less effort.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="...">
        <Header />
        <main className="min-h-screen px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
