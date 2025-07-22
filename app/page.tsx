"use server";
import { auth } from "../auth";
import HomePage from "@/components/ui/home-page";
import Link from "next/link";
import { redirect } from "next/navigation";
// This is the main page of your application
export default async function Home() {
  
  const session = await auth();
  if (!session) {
    redirect("/signin"); // Redirect to sign-in page if not authenticated
  }
  console.log ("page tsx ka session ",session) ;
  
  if(session?.user) {
    return ( <div>
      {/* <Link href="/user-info"> User Info </Link>
      <SignOutButton /> */}
      <HomePage user={session.user} />
    </div>
    );

  }

}