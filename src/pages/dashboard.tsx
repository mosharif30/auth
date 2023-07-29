import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
type FormData = {
  name: string;
  age: number;
  password: string;
};
const Dashboard = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => {
        console.log(res.data);
        setEmail(res.data.data.email);
        setName(res.data.data.name);
        setAge(res.data.data.age);
      })
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await axios.post("/api/completeAuth", data);
      console.log(res);

      if (res.status === 201) {
        setEmail(res.data.data.email);
        setName(res.data.data.name);
        setAge(res.data.data.age);
      }
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br flex-col ">
        <div className="block text-gray-800 font-bold">{email}</div>
        <div className="block text-gray-800 font-bold">{name}</div>
        <div className="block text-gray-800 font-bold">{age}</div>
        <button
          onClick={signOutHandler}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8  m-2 rounded"
        >
          Sign Out
        </button>

        {(!name || !age) && (
          <>
            <form
              className="bg-white p-8 rounded-md shadow-lg"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-800 font-bold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="age" className="block text-gray-800 font-bold">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  {...register("age", {
                    required: "Age is required",
                    min: {
                      value: 18,
                      message: "You must be at least 18 years old",
                    },
                    max: {
                      value: 100,
                      message: "You cannot be older than 100",
                    },
                  })}
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <span className="text-red-500 text-sm">
                    {errors.age.message}
                  </span>
                )}
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-800 font-bold"
                >
                  password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "password is required",
                  })}
                  className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm px-4 py-2"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 font-bold"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
