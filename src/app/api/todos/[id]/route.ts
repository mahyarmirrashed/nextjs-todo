import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  await prisma.todo.delete({
    where: { id: Number(id), userId: Number(userId) },
  });
  return NextResponse.json(
    { message: "Todo deleted" },
    { status: StatusCodes.OK },
  );
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  const updatedTodo = await prisma.todo.update({
    where: { id: Number(id), userId: Number(userId) },
    data: { completed: true },
  });
  return NextResponse.json(updatedTodo, { status: StatusCodes.OK });
}
