import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json([], { status: 401 });
  const pages = await prisma.docPage.findMany({ orderBy: [{ order: "asc" }, { title: "asc" }] });
  return NextResponse.json(pages);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  try {
    const page = await prisma.docPage.create({ data });
    return NextResponse.json(page, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
