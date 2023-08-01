// Import dependencies and modules
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { verifyPassword, verifyToken } from "@/utils/auth";
import { ApiResponse } from "@/interfaces/api";
import { connectDb } from "@/utils/connectDb";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

// Custom API response type definition
interface UserData {
  name: string;
  age: number;
  email: string;
  isAdmin: string;
}

function errorResponse(
  res: NextApiResponse<ApiResponse>,
  status: number,
  message: string
) {
  res.status(status).json({ status: "Failed", message });
}

async function completeAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { name, age, password } = req.body;
    const { token } = req.cookies;
    const secretKey = process.env.SECRET_KEY as string;

    // Validate email and password
    if (!password) {
      return errorResponse(res, 422, "Invalid Data");
    }

    if (!token) {
      return errorResponse(res, 401, "Unauthorized");
    }

    const result = await verifyToken(token, secretKey);
    if (!result) {
      return errorResponse(res, 401, "Unauthorized");
    }

    await connectDb();
    const user = await User.findOne({ email: result?.email });

    if (!user) {
      return errorResponse(res, 422, "User Not Found");
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 422, "Invalid Password");
    }

    user.name = name;
    user.age = age;
    await user.save();

    const userData: UserData = {
      name,
      age,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const expiresIn = 24 * 60 * 60;
    const newToken = sign(userData, secretKey, {
      expiresIn,
    });
    const serializedToken = serialize("token", newToken, {
      httpOnly: true,
      maxAge: expiresIn,
      path: "/",
    });
    res
      .status(201)
      .setHeader("Set-Cookie", serializedToken)
      .json({ status: "Success", message: "Data Added", data: userData });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
}

// Export the handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return errorResponse(res, 405, "Method Not Allowed");
  }

  return await completeAuthHandler(req, res);
}
