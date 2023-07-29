import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  password: string;
};

const SigninForm: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>(); // Specify FormData as the generic type for useForm
  useEffect(() => {
    axios
      .get("/api/user")
      .then(function (response) {
        if (response.status === 200) {
          router.replace("/dashboard");
        }
      })
      .catch(function () {});
  }, []);
  const onSubmit = async (data: FormData) => {
    // Handle form submission here
    try {
      const res = await axios.post("/api/auth/signin", data);
      console.log(res);
      if (res.status === 200) {
        toast.success("Welcome!", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        router.push("/dashboard");
      }
      reset(); // Reset the form after successful submission
    } catch (error: any) {
      console.log(error);
      setServerError(error.response.data.message);
      toast.error(error.response.data.message, {
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
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-6 mt-10 bg-white rounded shadow-md"
    >
      <div className="flex justify-center text-lg">Sign In</div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          Email
        </label>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className={`w-full px-3 py-2 placeholder-gray-300 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          Password
        </label>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          render={({ field }) => (
            <div className="flex">
              <input
                {...field}
                type={showPassword ? "text" : "password"}
                className={`flex-grow px-3 py-2 placeholder-gray-300 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="ml-2 px-3 py-2 text-sm font-medium text-indigo-600 focus:outline-none hover:text-indigo-800"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <p className="mt-2 mb-2 text-sm text-red-500">{serverError}</p>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700"
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default SigninForm;
