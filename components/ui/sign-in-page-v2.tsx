'use client';

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import logo from "@/public/logo.png"; // Adjust the path

export default function SignInUI() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [ripples, setRipples] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSignIn = async (e: React.MouseEvent) => {
  if (isSigningIn) return;

  setIsSigningIn(true);
  setStatusMessage(null);

  // Ripple effect
  const rect = e.currentTarget.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const id = Date.now();

  setRipples((prev) => [...prev, { id, x, y, size }]);
  setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

  try {
    await signIn("google", { redirect: true, callbackUrl: "/" });
    // No need to handle res.ok — user is being redirected
  } catch (err) {
    setStatusMessage("Failed to sign in. Please try again.");
    setIsSigningIn(false);
  }
};


  return (
<div className="flex items-center justify-center min-h-screen w-full bg-[#121212] text-white px-4">
    <div className="w-full max-w-2xl h-[40vh] bg-cyan-950 border border-gray-800 rounded-xl shadow-lg p-8 space-y-6 relative overflow-hidden">

        {/* Logo + Name */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow">
            <Image src={logo} alt="TrackX Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">TrackX</h1>
          <p className="text-gray-400 text-sm text-center">Your DSA journey starts here!</p>
        </div>

        {/* Status Message */}
{!isSigningIn && (error || statusMessage) && (
  <p className="text-sm text-center text-red-500">
    {error === "OAuthAccountNotLinked"
      ? "Account already linked with a different provider."
      : statusMessage || "Sign-in error. Please try again."}
  </p>
)}


        {/* Button */}
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="relative group w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Ripples */}
          {ripples.map((r) => (
            <span
              key={r.id}
              className="absolute bg-black/10 rounded-full pointer-events-none animate-ripple"
              style={{
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
              }}
            />
          ))}

          {/* Content */}
          <div className="flex items-center justify-center gap-2 relative z-10">
            {isSigningIn ? (
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            <span>{isSigningIn ? "Signing in..." : "Continue with Google"}</span>
          </div>
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-white">Terms</a> &{" "}
          <a href="#" className="underline hover:text-white">Privacy</a>.
        </p>
      </div>

      <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 0.4;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ripple {
          position: absolute;
          border-radius: 9999px;
          background-color: rgba(0, 0, 0, 0.2);
          animation: ripple 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
