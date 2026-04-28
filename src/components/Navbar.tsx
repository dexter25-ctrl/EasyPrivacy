"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative group-hover:scale-110 transition-transform duration-500">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
              <defs>
                <linearGradient id="shieldGradNav" x1="20" y1="20" x2="80" y2="80">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <radialGradient id="shieldShineNav" cx="30" cy="30" r="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M50 5 L15 20 V50 C15 75 50 95 50 95 C50 95 85 75 85 50 V20 L50 5Z" fill="url(#shieldGradNav)" />
              <path d="M50 12 L22 24 V50 C22 70 50 85 50 85 C50 85 78 70 78 50 V24 L50 12Z" fill="black" fillOpacity="0.2" />
              <path d="M50 5 L20 18 V22 L50 9 L80 22 V18 L50 5Z" fill="white" fillOpacity="0.3" />
              <circle cx="35" cy="35" r="15" fill="url(#shieldShineNav)" />
              <path d="M40 50 L47 57 L60 43" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-black text-white tracking-tighter">EasyPrivacy</span>
        </Link>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all">
                Se connecter
              </button>
            </SignInButton>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
}
