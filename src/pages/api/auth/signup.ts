// Import dependencies and modules
import { connectDb } from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";
import { ApiResponse } from "@/interfaces/api";

// Custom API response type definition

async function connectToDatabase() {
  try {
    await connectDb();
  } catch (error) {
    console.error(error);
    throw new Error("Error connecting to the database");
  }
}

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for password validation
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%.^&*])[a-zA-Z0-9!@#$%.^&*]{6,16}$/;

// Handler function for user registration (POST request)
async function registerUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Data" });
    }

    // Check email format
    if (!emailRegex.test(email)) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Email Address" });
    }

    // Check password format
    if (!passwordRegex.test(password)) {
      return res
        .status(422)
        .json({ status: "Failed", message: "Invalid Password Format" });
    }
    if (password !== confirmPassword) {
      return res
        .status(422)
        .json({
          status: "Failed",
          message: "Password and Confirm Password are not matched",
        });
    }

    await connectToDatabase();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ status: "Failed", message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log("hashedPassword", hashedPassword);

    // Create the new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    console.log("newUser", newUser);

    return res.status(201).json({ status: "Success", message: "User created" });
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

  return await registerUserHandler(req, res);
}
