import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const prisma = new PrismaClient();
export const {auth ,handlers,signIn,signOut} = NextAuth({
    providers:[Google],
    adapter: PrismaAdapter(prisma),
    pages: {
    signIn: "/signin", // 👈 Custom sign-in page route
  },
});