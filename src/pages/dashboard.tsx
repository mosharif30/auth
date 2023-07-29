import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    axios
      .get("/api/user")
      .then(function () {})
      .catch(function () {
        router.replace("/signin");
      });
  }, []);
  const signOutHandler = () => {
    axios
      .get("/api/auth/signout")
      .then(function () {
        router.replace("/");
      })
      .catch(function () {
        router.replace("/signin");
      });
  };
  return (
    <>
      <button
        onClick={signOutHandler}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8  m-2 rounded"
      >
        Sign Out
      </button>
    </>
  );
};

export default Dashboard;
