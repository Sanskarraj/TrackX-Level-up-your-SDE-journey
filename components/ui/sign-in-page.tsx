'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

//   console.log("Client-side session:", session);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error === "OAuthAccountNotLinked"
              ? "Account already linked with a different provider."
              : "Sign-in error. Please try again."}
          </p>
        )}

        <button
          onClick={() => signIn("google")}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-white font-semibold transition duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
