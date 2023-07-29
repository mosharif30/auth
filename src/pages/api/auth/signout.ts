// Import dependencies and modules
import { connectDb } from "@/utils/connectDb";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

// Custom API response type definition
type ApiResponse<T = {}> = {
  message: string;
  status: string;
};

// Handler function for clearing the authentication token (user logout)
async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const serializedToken = serialize("token", "", {
      path: "/",
      maxAge: 0,
    });

    res
      .status(204) // HTTP 204 No Content
      .setHeader("Set-Cookie", serializedToken)
      .end(); // End the response without any content
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
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ status: "Failed", message: "Method Not Allowed" });
  }

  try {
    return await logoutHandler(req, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "Failed", message: "Internal Server Error" });
  }
}
