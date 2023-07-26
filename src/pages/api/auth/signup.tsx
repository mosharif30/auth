export async function Handler() {}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { connectDb } from "@/utils/connectDb";
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { hashPassword } from "@/utils/auth";

type UserData = {
  name: string;
  phone: number;
  age?: number;
};

type ApiResponse = {
  message: string;
  status: string;
};

async function connectToDatabase() {
  try {
    await connectDb();
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to the database");
  }
}

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(422).json({ status: "Failed", message: "Invalid Data" });
  }
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(422).json({ status: "Failed", message: "Existed" });
  }
  const hashedPassword = await hashPassword(password);
  console.log("hashedPassword", hashedPassword);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });
  console.log("newUser", newUser);

  res.status(201).json({ status: "Success", message: "user created" });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return;
  } else {
    await connectToDatabase();
    return postHandler(req, res);
  }
}
