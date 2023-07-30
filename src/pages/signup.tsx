import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const [serverError, setServerError] = useState("");

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
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormData>(); // Specify FormData as the generic type for useForm

  const onSubmit = async (data: FormData) => {
    // Handle form submission here
    try {
      const res = await axios.post("/api/auth/signup", data);
      console.log(res);
      if (res.status === 201) {
        router.push("/signin");
        toast.success("Your SignUp Was Successful, Please LogIn", {
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
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto p-6 mt-10 bg-white rounded shadow-md"
    >
      <div className="flex justify-center text-lg">Sign Up</div>

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
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
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
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%.*?&]{8,}$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
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
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block mb-2 text-sm font-medium text-gray-600"
        >
          Confirm Password
        </label>
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          rules={{
            required: "Confirm Password is required",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          }}
          render={({ field }) => (
            <div className="flex">
              <input
                {...field}
                type={showConfirmPassword ? "text" : "password"}
                className={`flex-grow px-3 py-2 placeholder-gray-300 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="ml-2 px-3 py-2 text-sm font-medium text-indigo-600 focus:outline-none hover:text-indigo-800"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div>
        <p className="mt-2 mb-2 text-sm text-red-500">{serverError}</p>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
