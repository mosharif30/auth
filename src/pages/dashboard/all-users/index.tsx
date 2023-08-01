import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
// Import the UserModal component
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles if you are using it
import UserModal from "@/containers/userModal";
import { SignOutHandler } from "@/utils/signOutHandler";
import { ProfileData } from "@/interfaces/api";

interface FormValues {
  email: string;
  isAdmin: string;
  name: string;
  age: number;
}

const UserTable: React.FC = () => {
  const [editingUserId, setEditingUserId] = useState<string | undefined>(
    undefined
  );
  const { register, handleSubmit, setValue } = useForm<FormValues>();
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
      });
  }, []);

  const handleSignOut = async () => {
    // Implement the SignOutHandler function if not already defined
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

  const handleSaveUser: SubmitHandler<FormValues> = (data) => {
    // You can implement the save logic here to update the user data on the server
    console.log("Updated user data:", data);
    setEditingUserId(undefined);
    setIsModalOpen(false);
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
                    onClick={() => handleEditUser(user)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
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
