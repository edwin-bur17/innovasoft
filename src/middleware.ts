import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await prisma.usuario.findUnique({ where: { id: decoded.id } });

    if (
      !user ||
      user.sesion_token !== token ||
      !user.sesion_expira ||
      user.sesion_expira < new Date()
    ) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("session", "", { maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Token inválido:", err);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("session", "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"],
};
