import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: StatusCodes.BAD_REQUEST },
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: StatusCodes.CONFLICT },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return NextResponse.json(
    { message: "User created", userId: user.id },
    { status: StatusCodes.CREATED },
  );
}
