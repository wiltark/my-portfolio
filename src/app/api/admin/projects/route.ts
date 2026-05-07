import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json([], { status: 401 });
  const projects = await prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  const project = await prisma.project.create({ data });
  return NextResponse.json(project, { status: 201 });
}
