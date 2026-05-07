import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json([], { status: 401 });
  const tutorials = await prisma.tutorial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(tutorials);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  try {
    const tutorial = await prisma.tutorial.create({ data });
    return NextResponse.json(tutorial, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
