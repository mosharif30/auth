export async function Handler() {}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectDb } from "@/utils/connectDb";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

interface ApiResponse<T> {
  message: string;
  status?: string;
  data?: T;
}
interface TokenPayload {
  email: string;
  // Add more properties if necessary
}
async function connectToDatabase() {
  try {
    await connectDb();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Error connecting to the database");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPayload>>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed", status: "error" });
    return;
  }

  const { token } = req.cookies;
  const secretKey: any = process.env.SECRET_KEY;

  if (!token) {
    res.status(401).json({ message: "Unauthorized", status: "error" });
    return;
  }

  await connectToDatabase();

  const tokenPayload = await verifyToken(token, secretKey);

  if (tokenPayload) {
    res.status(200).json({ message: "Success", data: tokenPayload });
  } else {
    res.status(401).json({ message: "Unauthorized", status: "error" });
  }
}
