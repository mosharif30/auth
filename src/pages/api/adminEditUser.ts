import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/auth";
import { ApiResponse, ProfileData } from "@/interfaces/api";
import { connectDb } from "@/utils/connectDb";
import User from "@/models/User";

const StatusCodes = {
  Ok: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  InternalServerError: 500,
};

const sendUnauthorizedResponse = (res: NextApiResponse) => {
  return res
    .status(StatusCodes.Unauthorized)
    .json({ message: "Unauthorized", status: "error" });
};

const sendErrorResponse = (
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
    if (req.method !== "PUT") {
      return sendErrorResponse(
        res,
        StatusCodes.MethodNotAllowed,
        "Method Not Allowed"
      );
    }

    const { token } = req.cookies;
    const secretKey = process.env.SECRET_KEY as string;

    if (!token) {
      return sendUnauthorizedResponse(res);
    }

    const tokenPayload = await verifyToken(token, secretKey);

    if (!tokenPayload || tokenPayload.isAdmin !== "true") {
      return sendUnauthorizedResponse(res);
    }

    await connectDb();
    const user = await User.findOne(
      { email: tokenPayload.email },
      { password: 0 }
    );

    if (!user || user.isAdmin !== "true") {
      return sendUnauthorizedResponse(res);
    }

    const { data }: { data: ProfileData } = req.body;
    if (!data.email) {
      return sendErrorResponse(res, StatusCodes.BadRequest, "Invalid Data");
    }

    const editingUser = await User.findOne(
      { email: data.email },
      { password: 0 }
    );
    if (!editingUser) {
      return sendErrorResponse(res, StatusCodes.NotFound, "User not found");
    }

    if (editingUser.isAdmin === "true") {
      return sendErrorResponse(
        res,
        StatusCodes.Forbidden,
        "You cannot edit admin users"
      );
    }

    if (data.isAdmin && editingUser.isAdmin !== data.isAdmin) {
      return sendErrorResponse(
        res,
        StatusCodes.Forbidden,
        "You cannot edit user status"
      );
    }

    const updatedUser: ProfileData = await User.findByIdAndUpdate(
      editingUser.id,
      data,
      {
        new: true,
      }
    ).select({ password: 0 });

    if (!updatedUser) {
      return sendErrorResponse(res, StatusCodes.NotFound, "User not found");
    }

    return res
      .status(StatusCodes.Ok)
      .json({ message: "User updated", data: updatedUser });
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      StatusCodes.InternalServerError,
      "Error Updating User"
    );
  }
}
