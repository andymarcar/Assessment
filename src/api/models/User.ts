export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
}
