import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function AppNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/10 bg-black/100 backdrop-blur-2xl backdrop-saturate-150">
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
  );
}
