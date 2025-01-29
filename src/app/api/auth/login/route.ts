import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json(
      { error: "User does not exist" },
      { status: StatusCodes.NOT_FOUND },
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );
  return NextResponse.json(
    { message: "Login successful", token },
    { status: StatusCodes.OK },
  );
}
