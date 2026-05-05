import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/src/components/AppProviders";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESHOP. - PREMIUM NETWORK",
  description: "HIGH-END TECHNOLOGY DISPATCH.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
        <AppProviders>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
