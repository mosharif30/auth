import { SignOutHandler } from "@/utils/signOutHandler";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  email?: string;
  name: string;
  age: number;
  password: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    email: null,
    name: null,
    age: null,
    password: null,
  });

  useEffect(() => {
    fetchData();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      age: 0,
      password: "",
    },
  });
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/user");
      const { email, name, age } = res.data.data;
      setProfile({
        email: email,
        name: name,
        age: age,
        password: null,
      });
    } catch (error) {
      router.replace("/signin");
      toast.error("Unauthorized! Please Sign In First", {
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
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      delete data.email;

      const res = await axios.post("/api/completeAuth", data);
      const { email, name, age } = res.data.data;
      setProfile({
        email: email,
        name: name,
        age: age,
        password: null,
      });
      reset();
      toast.success("Profile updated successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error: any) {
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

      if (error.response.status === 401) {
        await SignOutHandler();
        router.replace("/");
      }
    }
  };
  return (
    <>
      {" "}
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center pt-16">
          <div className="w-full">
            <button
              onClick={async () => {
                await SignOutHandler(true);
                router.replace("/");
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 m-2 rounded "
            >
              Sign Out
            </button>
            <h1 className="text-3xl text-center mb-6 font-bold">
              Profile Page
            </h1>

            {!profile.name && (
              <>
                {" "}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="max-w-md mx-auto p-4"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-bold mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register("name", {
                        required: "Name is required",
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.name && (
                      <p className="text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="age"
                      className="block text-gray-700 font-bold mb-1"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      {...register("age", {
                        required: "Age is required",
                        min: {
                          value: 18,
                          message: "Age must be at least 18",
                        },
                        max: {
                          value: 120,
                          message: "Age must be at most 120",
                        },
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.age && (
                      <p className="text-red-500">{errors.age.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-bold mb-1"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </>
            )}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-center">Profile Details</h2>
              <div className="max-w-md mx-auto bg-white p-4 mt-4 shadow-md rounded-md">
                <p className="mb-2">
                  <span className="font-bold">Email:</span> {profile.email}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Name:</span> {profile.name}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Age:</span> {profile.age}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
