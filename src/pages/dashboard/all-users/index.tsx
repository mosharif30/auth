import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserModal from "@/containers/userModal";
import { SignOutHandler } from "@/utils/signOutHandler";
import { ProfileData } from "@/interfaces/api";

const UserTable: React.FC = () => {
  const [editingUserId, setEditingUserId] = useState<string | undefined>(
    undefined
  );
  const { setValue } = useForm<ProfileData>();
  const [users, setUsers] = useState<ProfileData[]>([]);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get<{ data: ProfileData[] }>("/api/getAllUsers")
      .then(function (response) {
        if (response.status === 200) {
          setUsers(response.data.data);
        }
      })
      .catch(async function (error) {
        if (error.response.status === 401) {
          await handleSignOut();
          toast.error(error.response.data.message, {});
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await SignOutHandler();
    router.replace("/");
  };

  const handleEditUser = (user: ProfileData) => {
    setEditingUserId(user._id);
    setIsModalOpen(true);
    setValue("email", user.email);
    setValue("isAdmin", user.isAdmin);
    setValue("name", user.name);
    setValue("age", user.age);
  };
  const handleDeleteUser = async (user: ProfileData) => {
    try {
      const users = await axios.delete(`/api/adminDeleteUser/${user._id}`);
      toast.success(users.data.message, {});
      setUsers(users.data.data);
    } catch (error: any) {
      toast.error(error.response.data.message, {});
    }
  };
  const handleSaveUser: SubmitHandler<ProfileData> = async (data) => {
    try {
      const res = await axios.put("/api/adminEditUser", { data });
      console.log(res);

      setEditingUserId(undefined);
      setIsModalOpen(false);
      const replaceObjectById = (
        users: ProfileData[],
        newObject: ProfileData
      ) => {
        const index = users.findIndex((obj: any) => obj._id === newObject._id);

        if (index !== -1) {
          users[index] = newObject;
        }
      };
      replaceObjectById(users, res.data.data);
      toast.success(res.data.message, {});
    } catch (error: any) {
      toast.error(error.response.data.message, {});
    }
  };

  const handleCloseModal = () => {
    setEditingUserId(undefined);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Email</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Age</th>
              <th className="border p-2">Admin</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="even:bg-gray-100">
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.age}</td>
                <td
                  className={`border p-2 ${
                    user.isAdmin === "true" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {user.isAdmin}
                </td>
                <td className="border p-2">{user.createdAt}</td>
                <td className="border p-2">
                  {" "}
                  <button
                    disabled={user.isAdmin === "true"}
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
                  >
                    Edit
                  </button>
                  <button
                    disabled={user.isAdmin === "true"}
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2 disabled:bg-slate-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUserId && (
        <UserModal
          user={users.find((user) => user._id === editingUserId) as ProfileData}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserTable;
