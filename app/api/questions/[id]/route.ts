// app/api/questions/[id]/route.ts
import { prisma } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const question = await prisma.questions.findUnique({ where: { id } });

  if (!question) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  return NextResponse.json(question);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  try {
    
const updated = await prisma.questions.update({
  where: { id },
  data: {
    ...(body.title && { title: body.title }),
    ...(body.difficulty && { difficulty: body.difficulty }),
    ...(body.category && { category: body.category }),
    ...(body.GFGLink && { GFGLink: body.GFGLink }),
    ...(body.LeetCodeLink && { LeetCodeLink: body.LeetCodeLink }),
    ...(body.SolutionLink && { SolutionLink: body.SolutionLink }),
    ...(body.VideoLink && { VideoLink: body.VideoLink }),
  },
});


    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await prisma.questions.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
