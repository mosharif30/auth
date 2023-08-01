import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/auth";
import { ApiResponse } from "@/interfaces/api";
import { connectDb } from "@/utils/connectDb";
import User from "@/models/User";

const unauthorizedAccess = (res: NextApiResponse) => {
  return res.status(401).json({ message: "Unauthorized", status: "error" });
};

// Helper function to handle errors
const handleError = (
  res: NextApiResponse,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({ message, status: "error" });
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed", status: "error" });
    return;
  }

  const { token } = req.cookies;
  const secretKey = process.env.SECRET_KEY as string;

  if (!token) {
    return unauthorizedAccess(res);
  }

  const tokenPayload = await verifyToken(token, secretKey);
  console.log("tokenPayload", tokenPayload);

  if (!tokenPayload || tokenPayload?.isAdmin !== "true") {
    return unauthorizedAccess(res);
  }

  await connectDb();
  const user = await User.findOne(
    { email: tokenPayload?.email },
    { password: 0 }
  );
  console.log("user", user);

  if (!user || user.isAdmin !== "true") {
    return unauthorizedAccess(res);
  }

  try {
    const users = await User.find({}, { password: 0 });
    return res
      .status(200)
      .json({ message: "Data retrieved successfully", data: users });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Error retrieving data");
  }
}
