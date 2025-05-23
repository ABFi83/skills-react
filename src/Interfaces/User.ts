import { RoleResponse } from "./Project";

export interface UserResponse {
  id: string;
  username: string;
  name?: string;
  surname?: string;
  role?: RoleResponse;
  code: string;
  isAdmin: boolean;
  ratingAverage?: number;
}
