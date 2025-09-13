import { Request, Response } from "express";
import * as authService from "../services";
import {
  LoginPayload,
  LogoutPayload,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../interfaces";
import { USER_MESSAGES, AUTH_MESSAGES } from "../constants/messages";

// ---------- LOGIN ----------
export const login = async (req: Request, res: Response) => {
  try {
    // frontend sends { username, password }
    const payload: LoginPayload = req.body;
    const result = await authService.loginUser(payload);
    return res.sendSuccess(result, USER_MESSAGES.LOGIN_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, USER_MESSAGES.LOGIN_FAILED);
  }
};

// ---------- SIGNUP ----------
export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body as { name: string; email: string; password: string; country?: string };
    const payload: SignupPayload = {
      username: body.name,
      email: body.email,
      password: body.password,
    };
    const result = await authService.signupUser(payload);
    return res.sendSuccess(result, USER_MESSAGES.SIGNUP_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, USER_MESSAGES.SIGNUP_FAILED);
  }
};

// ---------- FORGOT PASSWORD ----------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const payload: ForgotPasswordPayload = req.body; // { email }
    const result = await authService.forgotPassword(payload);
    return res.sendSuccess(result, AUTH_MESSAGES.FORGOT_PASSWORD_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, AUTH_MESSAGES.FORGOT_PASSWORD_FAILED);
  }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const payload: ResetPasswordPayload = req.body; // { token, newPassword }
    const result = await authService.resetPassword(payload);
    return res.sendSuccess(result, AUTH_MESSAGES.RESET_PASSWORD_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, AUTH_MESSAGES.RESET_PASSWORD_FAILED);
  }
};

// ---------- LOGOUT ----------
export const logout = async (req: Request, res: Response) => {
  try {
    // frontend sends { username } + Authorization header (token is optional here in our flow)
    const payload: LogoutPayload = req.body;
    const result = await authService.logoutUser(payload);
    return res.sendSuccess(result, USER_MESSAGES.LOGOUT_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, USER_MESSAGES.LOGOUT_FAILED);
  }
};
