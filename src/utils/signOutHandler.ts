import axios from "axios";
import { toast } from "react-toastify";
export const SignOutHandler = async (notify?: boolean) => {
  try {
    await axios.get("/api/auth/signout");

    if (notify) {
      toast.info("You are Signed Out", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  } catch (error) {}
};
