import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { ulid } from 'ulid';

const prisma = new PrismaClient();

// POST handler
export async function POST(req: Request) {
  try {
    // 1. Parse and validate body
    const body = await req.json();
    console.log("Request Body:", body);
    
    const { userId, questionIds } = body;
    
    if (!userId || !Array.isArray(questionIds)) {
      console.warn("Validation failed: Missing userId or questionIds");
      return NextResponse.json(
        { error: "Missing userId or questionIds" }, 
        { status: 400 }
      );
    }

    // 2. Prepare data with encoded IDs
    const data = questionIds.map((questionId: string, index: number) => {
      // 👇 Use encodeId with userId and index (single digit serial)
      const id = ulid();
      return {
        id,
        userId,
        questionId,
        createdAt: new Date(),
      };
    });
    
    console.log("Prepared Data:", data);

    // 3. Insert into DB
    const result = await prisma.status.createMany({
      data,
      skipDuplicates: true,
    });
    
    console.log("DB Insert Result:", result);

    // 4. Return success
    return NextResponse.json({
      message: "Statuses created successfully",
      result,
      insertedCount: result.count,
    });
  } catch (error: any) {
    console.error("Error creating status:", error);

    return NextResponse.json({
      error: "Internal Server Error",
      details: error?.message || error.toString(),
    }, { status: 500 });
  }
}

// GET handler
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in query" }, { status: 400 });
    }

    const statuses = await prisma.status.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ statuses });
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
