import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json([], { status: 401 });
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  const skill = await prisma.skill.create({ data });
  return NextResponse.json(skill, { status: 201 });
}
