import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import ConvexClientProvider from "./ConvexClientProvider";
import AppFooter from "./components/AppFooter";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400","500","600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Slack Web Chat",
  description: "Chat application built with Next.js and Clerk",
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
            <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-2xl backdrop-saturate-150">
              <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                                    <span className="text-xl font-semibold text-white">Slack Chat</span>
                </Link>
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <SignInButton>
                      <button className="px-3 py-2 text-sm rounded-lg border border-white/15 text-[#E4E4E7] hover:bg-white/10 transition">
                        Sign in
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white rounded-full font-medium text-sm h-10 px-4 shadow-[0_0_10px_rgba(124,58,237,0.25)]">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            <main className="pt-16">
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </main>
            <AppFooter />
          </body>
        </html>
      </ClerkProvider>
  );
}
