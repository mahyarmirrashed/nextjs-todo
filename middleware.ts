import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: number;
}

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: StatusCodes.UNAUTHORIZED });
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as CustomJwtPayload;

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", user.userId.toString());

    return NextResponse.next({ headers: requestHeaders });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: StatusCodes.UNAUTHORIZED });
  }
}

export const config = {
  matcher: ["/api/todos/:path*"],
};
