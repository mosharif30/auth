import axios from "axios";
import { toast } from "react-toastify";
export const SignOutHandler = async (notify?: boolean) => {
  try {
    await axios.get("/api/auth/signout");

    if (notify) {
      toast.info("You are Signed Out", {});
    }
  } catch (error) {}
};
