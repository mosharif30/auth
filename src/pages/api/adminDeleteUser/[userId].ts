import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/auth";
import { ApiResponse, ProfileData } from "@/interfaces/api";
import { connectDb } from "@/utils/connectDb";
import User from "@/models/User";

const unauthorizedAccess = (res: NextApiResponse) => {
  return res.status(401).json({ message: "Unauthorized", status: "error" });
};

const handleError = (
  res: NextApiResponse<ApiResponse>,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({ message, status: "error" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    if (req.method !== "DELETE") {
      return handleError(res, 405, "Method Not Allowed");
    }

    const { token } = req.cookies;
    const secretKey = process.env.SECRET_KEY as string;
    const { userId } = req.query;

    if (!token) {
      return unauthorizedAccess(res);
    }

    const tokenPayload = await verifyToken(token, secretKey);
    console.log("tokenPayload", tokenPayload);

    if (!tokenPayload || tokenPayload.isAdmin !== "true") {
      return unauthorizedAccess(res);
    }

    await connectDb();
    const user = await User.findOne(
      { email: tokenPayload.email },
      { password: 0 }
    );
    console.log("user", user);

    if (!user || !user.isAdmin) {
      return unauthorizedAccess(res);
    }

    const deletedUser = await User.findById(userId, { password: 0 });
    console.log("deletedUser", deletedUser);

    if (!deletedUser) {
      return handleError(res, 404, "User not found");
    }

    if (deletedUser.isAdmin === "true") {
      return handleError(res, 403, "You cannot delete an admin user");
    }

    await User.findByIdAndRemove(userId, { password: 0 });
    const users = await User.find({}, { password: 0 });

    return res
      .status(200)
      .json({ message: `User ${deletedUser.email} deleted`, data: users });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "Error Deleting User");
  }
}
