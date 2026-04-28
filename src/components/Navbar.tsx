"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.8L18.5 8 12 11.2 5.5 8 12 4.8z" />
            </svg>
          </div>
          <span className="text-xl font-black text-white tracking-tighter">EasyPrivacy</span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-white/60 hover:text-teal-400 transition-colors text-sm font-medium"
              >
                Mon Dashboard
              </Link>
              <div className="flex items-center gap-3 bg-white/5 border border-teal-500/20 px-2 py-1.5 rounded-xl">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-lg"
                    }
                  }}
                />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
