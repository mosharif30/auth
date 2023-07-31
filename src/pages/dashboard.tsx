import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { SignOutHandler } from "@/utils/signOutHandler";
import { FormData, ProfileData } from "@/interfaces/api";

const Dashboard = () => {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    email: "null",
    name: "null",
    age: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/user");
      const { email, name, age } = data.data;
      setProfile({ email, name, age });
      reset({ name, age });
    } catch (error) {
      handleUnauthorized();
    }
  };

  const handleUnauthorized = () => {
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
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await axios.post("/api/completeAuth", data);
      const { email, name, age }: ProfileData = res.data.data;
      setProfile({ email, name, age });
      reset();
      setValue("name", name);
      setValue("age", age);
      setEdit(false);
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
        await handleSignOut();
      }
    }
  };

  const handleSignOut = async () => {
    await SignOutHandler();
    router.replace("/");
  };

  const handleEditToggle = () => {
    setEdit((prevEdit) => !prevEdit);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center pt-16">
        <div className="w-full sm:max-w-md">
          <button
            onClick={handleSignOut}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded"
          >
            Sign Out
          </button>

          <h1 className="text-3xl text-center mb-6 font-bold">Profile Page</h1>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-center">Profile Details</h2>
            <div className="bg-white rounded-md shadow-md p-4 mt-4">
              <p className="mb-2">
                <span className="font-bold">Email:</span> {profile.email}
              </p>
              <p className="mb-2">
                <span className="font-bold">Name:</span> {profile.name}
              </p>
              <p className="mb-2">
                <span className="font-bold">Age:</span> {profile.age}
              </p>
              {profile.name && !edit && (
                <button
                  onClick={handleEditToggle}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 mt-2 rounded"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          {(!profile.name || edit) && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-md shadow-md p-4"
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
                  defaultValue={profile.name || ""}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 mt-2">{errors.name.message}</p>
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
                  <p className="text-red-500 mt-2">{errors.age.message}</p>
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
                  <p className="text-red-500 mt-2">{errors.password.message}</p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
                {edit && (
                  <button
                    onClick={handleEditToggle}
                    className="w-full bg-blue-500 text-white py-2 mt-2 rounded-md hover:bg-blue-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
