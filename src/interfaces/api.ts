export interface TokenPayload {
  email: string;
}
export interface ApiResponse<T = {}> {
  message: string;
  status?: string;
  data?: T;
}
export type ProfileData = {
  email: string;
  name: string;
  age: number;
  isAdmin: string;
};

export type FormData = {
  name: string;
  age: number;
  password: string;
};
