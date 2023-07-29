export interface TokenPayload {
  email: string;
}
export interface ApiResponse<T = {}> {
  message: string;
  status?: string;
  data?: T;
}
