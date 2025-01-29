import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: StatusCodes.UNAUTHORIZED });
  }

  const todos = await prisma.todo.findMany({ where: { userId: Number(userId) } })
  return NextResponse.json(todos, { status: StatusCodes.OK });
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: StatusCodes.UNAUTHORIZED });
  }

  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: StatusCodes.BAD_REQUEST });
  }

  const todo = await prisma.todo.create({
    data: { title, userId: Number(userId) }
  })
  return NextResponse.json(todo, { status: StatusCodes.OK });
}
