import { SubmitHandler } from "react-hook-form";

export interface TokenPayload {
  email: string;
}
export interface ApiResponse<T = {}> {
  message: string;
  status?: string;
  data?: T;
}
export type ProfileData = {
  _id?: string;
  email: string;
  isAdmin: string;
  name: string;
  age: number;
  createdAt?: string;
};

export type FormData = {
  name: string;
  age: number;
  password: string;
};
export interface UserModalProps {
  user: ProfileData;
  isOpen: boolean;
  onClose: () => void;
  onSave: SubmitHandler<ProfileData>;
}
