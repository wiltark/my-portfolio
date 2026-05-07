import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json([], { status: 401 });
  const cats = await prisma.docCategory.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  try {
    const cat = await prisma.docCategory.create({ data });
    return NextResponse.json(cat, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
