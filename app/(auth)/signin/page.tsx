// app/signin/page.tsx
import { auth } from "@/auth";
import SignInClient from "@/components/ui/sign-in-page-v2";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  console.log("SignInPage session:", session);
  if(session?.user) {
    redirect("/"); // Redirect to home if already signed in
  }
else
  return <SignInClient />;
}
