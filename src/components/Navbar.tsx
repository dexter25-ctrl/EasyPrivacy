"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  // Simulation de l'état de connexion pour le test visuel
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Kaufmann");

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
          {!isLoggedIn ? (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Connexion
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className="text-white/60 hover:text-teal-400 transition-colors text-sm font-medium"
              >
                Mon Dashboard
              </Link>
              <div className="flex items-center gap-3 bg-white/5 border border-teal-500/20 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span className="text-sm font-bold text-white">{userName}</span>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="ml-2 text-white/40 hover:text-red-400 transition-colors"
                  title="Déconnexion"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
