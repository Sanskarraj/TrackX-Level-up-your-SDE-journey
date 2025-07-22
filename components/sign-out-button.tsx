"use client";
import { logout } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();        // ✅ first log the user out
    router.push("/signin"); // ✅ then redirect on client
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  );
};
