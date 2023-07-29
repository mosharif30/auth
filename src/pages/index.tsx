import { useRouter } from "next/router";
import React from "react";

const SigninSignup = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="bg-slate-600 p-16 rounded shadow-md">
        <h1 className="text-5xl font-bold mb-6 text-white">Welcome!</h1>
        <div className="flex justify-between">
          <button
            onClick={() => router.push("signin")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8  m-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("signup")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8  m-2 rounded"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninSignup;
