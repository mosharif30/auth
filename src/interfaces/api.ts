export interface TokenPayload {
  email: string;
}
export interface ApiResponse<T = {}> {
  message: string;
  status?: string;
  data?: T;
}
export type ProfileData = {
  email: string | null;
  name: string | null;
  age: number | null;
};

export type FormData = {
  name: string;
  age: number;
  password: string;
};
