import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import AppFooter from "./components/AppFooter";
import AppNavbar from "./components/AppNavbar";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Slack Chat",
  description: "Chat application built with Next.js, Clerk, and Convex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className={`antialiased bg-[#0F0F10] text-[#E4E4E7]`}>
          <AppNavbar />
          <main className="pt-16">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </main>
          <AppFooter />
        </body>
      </html>
      </ClerkProvider>
  );
}
