export interface LoginPayload {
  username: string;
  password: string;
}

export interface LogoutPayload {
  username: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}
