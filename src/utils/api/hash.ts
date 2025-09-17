import crypto from "crypto";
import bcrypt from "bcryptjs";

export function hashResetToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password:string): Promise<string> {
  return await bcrypt.hash(password, 10);
}