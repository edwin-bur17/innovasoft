import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

      await prisma.usuario.update({
        where: { id: decoded.id },
        data: { sesion_token: null, sesion_expira: null },
      });
    } catch (err) {
      console.error("Error al invalidar sesión en BD:", err);
    }

    cookieStore.delete("session");
  }

  return NextResponse.json({ message: "Sesión cerrada" });
}
