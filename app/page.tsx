"use server";

import { auth } from "../auth";
import HomePage from "@/components/ui/home-page";
import { redirect } from "next/navigation";

// Define a stricter user type for the HomePage component
type AuthUser = {
  id: string;             // ✅ Required
  name?: string;
  email?: string;
  image?: string;
};

export default async function Home() {
  const session = await auth();

  // If session is missing, redirect to sign-in
  if (!session) {
    redirect("/signin");
  }

  // Log for debugging
  console.log("page tsx ka session", session);

  const user = session.user;

  // Ensure user has a valid ID before rendering
  if (user?.id && user?.name) {
    return (
      <div>
        {/* You can add more UI components here */}
        <HomePage
          user={{
            id: user.id,
            name: user.name,
            email: user.email ?? "",
            image: user.image ?? "",
          }}
        />
      </div>
    );
  }

  // Optional: handle the case where user.id is missing
  return (
    <div className="p-4 text-red-500">
      Invalid session: user ID is missing.
    </div>
  );
}
