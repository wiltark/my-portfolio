import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  return NextResponse.json(profile ?? {});
}

export async function PUT(req: Request) {
  if (!await isAuthenticated()) return NextResponse.json({}, { status: 401 });
  const data = await req.json();
  const profile = await prisma.profile.upsert({
    where: { id: "main" },
    create: { id: "main", ...data },
    update: data,
  });
  return NextResponse.json(profile);
}
