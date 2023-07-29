import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/auth";
import { TokenPayload, ApiResponse } from "@/interfaces/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPayload>>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed", status: "error" });
    return;
  }

  const { token } = req.cookies;
  const secretKey = process.env.SECRET_KEY as string;

  if (!token) {
    res.status(401).json({ message: "Unauthorized", status: "error" });
    return;
  }

  const tokenPayload = await verifyToken(token, secretKey);

  if (tokenPayload) {
    res.status(200).json({ message: "Success", data: tokenPayload });
  } else {
    res.status(401).json({ message: "Unauthorized", status: "error" });
  }
}
