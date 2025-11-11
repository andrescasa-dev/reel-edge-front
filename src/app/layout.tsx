import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClientProvider, MSWProvider } from "@/core/providers";
import { Toaster } from "sonner";
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
  title: "Casino Research Front",
  description: "Casino Research Frontend Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MSWProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </MSWProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
