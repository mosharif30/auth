import { UserModalProps } from "@/interfaces/api";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface UserData {
  _id: string;
  email: string;
  isAdmin: string;
  name: string;
  age: number;
  createdAt: string;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const { register, handleSubmit, setValue } = useForm<UserData>();

  useEffect(() => {
    if (isOpen) {
      // Set form fields' values when the modal opens
      setValue("email", user.email);
      setValue("isAdmin", user.isAdmin);
      setValue("name", user.name);
      setValue("age", user.age);
    }
  }, [isOpen, user, setValue]);

  return (
    <div className={`fixed inset-0 ${isOpen ? "flex" : "hidden"}`}>
      {/* <div className="fixed inset-0 bg-gray-500 opacity-75"></div> */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="rounded p-6 w-96 bg-gray-200">
          <h2 className="text-2xl font-semibold mb-6">Edit User</h2>
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                disabled
                type="text"
                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight"
                {...register("email", { required: true })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight"
                {...register("name", { required: true })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Age
              </label>
              <input
                type="number"
                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight"
                {...register("age", { required: true, min: 0 })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Admin
              </label>
              <select
                disabled={true}
                className="w-full border rounded py-2 px-3 text-gray-700 leading-tight"
                {...register("isAdmin", { required: true })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                className="border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
