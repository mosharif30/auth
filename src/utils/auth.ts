import bcrypt from "bcryptjs";
import { JwtPayload, verify } from "jsonwebtoken";

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

function verifyToken(
  token: string,
  secretKey: string
): { email: string } | null {
  try {
    const result = verify(token, secretKey) as JwtPayload;
    return { email: result.email };
  } catch (error) {
    return null;
  }
}
export { hashPassword, verifyPassword, verifyToken };
