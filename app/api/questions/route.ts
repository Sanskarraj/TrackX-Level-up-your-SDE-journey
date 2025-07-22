// app/api/questions/route.ts
import { prisma } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// GET: fetch all questions ordered by ID (ascending)
export async function GET() {
  const questions = await prisma.questions.findMany({
    orderBy: { id: "asc" }, // 👈 change here
  });

  return NextResponse.json(questions);
}

// POST: create new question
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const newQuestion = await prisma.questions.create({
      data: {
        title: body.title,
        difficulty: body.difficulty,
        category: body.category,
        GFGLink: body.GFGLink,
        LeetCodeLink: body.LeetCodeLink,
        SolutionLink: body.SolutionLink,
        VideoLink: body.VideoLink,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
