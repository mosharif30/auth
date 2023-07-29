// Import dependencies and modules
import { connectDb } from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

// Custom API response type definition
type ApiResponse<T = {}> = {
  message: string;
  status: string;
  data?: T;
};

// Function to connect to the database
async function connectToDatabase() {
  try {
    await connectDb();
  } catch (error) {
    console.error(error);
    throw new Error("Error connecting to the database");
  }
}

// Handler function for POST requests
async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Data" });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(422)
        .json({ status: "Failed", message: "User Not Found" });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Password" });
    }

    const secretKey: any = process.env.SECRET_KEY;
    const expiresIn = 24 * 60 * 60;
    const token = sign({ email }, secretKey, { expiresIn });
    const serializedToken = serialize("token", token, {
      httpOnly: true,
      maxAge: expiresIn,
      path: "/",
    });

    return res
      .status(200)
      .setHeader("Set-Cookie", serializedToken)
      .json({
        status: "Success",
        message: "Welcome",
        data: { email: user.email },
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "Failed", message: "Internal Server Error" });
  }
}

// Export the handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "Failed", message: "Method Not Allowed" });
  }

  return await loginHandler(req, res);
}
