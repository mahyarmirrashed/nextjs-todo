import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
}

export function middleware(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");
  if (!authorizationHeader) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    console.log(token, process.env.JWT_SECRET);
    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as CustomJwtPayload;

    const response = NextResponse.next();
    response.headers.set("x-user-id", userId.toString());

    return response;
  } catch (error) {
    console.warn("Verification failed:", error);

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: StatusCodes.UNAUTHORIZED },
    );
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/api/todos", "/api/todos/:path*"],
};
