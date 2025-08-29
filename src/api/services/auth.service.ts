import jwt from "jsonwebtoken";
import * as authDAO from "../dao";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../errors/appError";
import { decryptData, encryptData } from "../utils/crypto.util";
import {
  JwtPayload,
  LoginPayload,
  LogoutPayload,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../interfaces";
import { resetPasswordEmailTemplate } from "../../email";
import sendMail from "../utils/mailer";

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1h";

// ---------- LOGIN ----------
export const loginUser = async ({ username, password }: LoginPayload) => {
  const user = await authDAO.findUserByEmail(username);
  if (!user) throw new NotFoundError("User not found");
  // if (user.IsActive !== 1) throw new ForbiddenError("User is inactive");

  const decryptedPassword = decryptData(user.Password);
  if (password !== decryptedPassword) throw new UnauthorizedError("Invalid credentials");

  const payload: JwtPayload = {
    id: user.Id,
    username: user.UserName,
    roleId: user.UserRoleId,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

  await authDAO.updateUserLoginStatus(user.Id, 0); // mark logged in
  // await authDAO.storeLoginToken(user.Id, token, new Date(Date.now() + 3600000)); // optional token store

  return { token };
};



// ---------- SIGNUP ----------
export const signupUser = async ({ username, email, password }: SignupPayload) => {
  const byUsername = await authDAO.findUserByUsername(username);
  if (byUsername) throw new BadRequestError("Username already exists");

  const byEmail = await authDAO.findUserByEmail(email);
  if (byEmail) throw new BadRequestError("Email already exists");

  const encryptedPassword = encryptData(password);
  const roleId = 2; // default roleId

  const newUser = await authDAO.createUser({
    username,
    email,
    password: encryptedPassword,
    isActive: 1,
    roleId,
  });

  if (!newUser) throw new ForbiddenError("Failed to create user");

  const payload: JwtPayload = {
    id: newUser.Id,
    username: newUser.UserName,
    roleId: newUser.UserRoleId,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  return { token };
};


export const forgotPassword = async ({ email }: { email: string }) => {
  const user = await authDAO.findUserByEmail(email);
  if (!user) throw new NotFoundError("User not found");

  // Generate a reset token
  const resetToken = jwt.sign({ id: user.Id }, JWT_SECRET, { expiresIn: "15m" });

  // Store the token in the database
  await authDAO.storeResetToken(
    user.Id,
    resetToken,
    new Date(Date.now() + 15 * 60 * 1000)
  );

  // Create the email HTML using your template
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const htmlContent = resetPasswordEmailTemplate(frontendUrl, resetToken);

  // Send email via Brevo
  const emailResult = await sendMail(
    email, // to
    undefined, // cc
    'Reset Your Password', // subject
    htmlContent // body
  );

  if (!emailResult.success) {
    throw new Error('Failed to send password reset email');
  }

  return { success: true, message: 'Password reset email sent' };
};


// ---------- RESET PASSWORD ----------
export const resetPassword = async ({ token, newPassword }: ResetPasswordPayload) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await authDAO.findUserById(decoded.id);
    if (!user) throw new NotFoundError("User not found");

    const tokenRow = await authDAO.getResetToken(user.Id);
    if (!tokenRow || tokenRow.ResetToken !== token) throw new UnauthorizedError("Invalid token");
    if (tokenRow.Expiry && new Date(tokenRow.Expiry).getTime() < Date.now())
      throw new UnauthorizedError("Token expired");

    const encryptedPassword = encryptData(newPassword);
    const ok = await authDAO.updateUserPassword(user.Id, encryptedPassword);
    if (!ok) throw new ForbiddenError("Failed to reset password");

    await authDAO.clearResetToken(user.Id);
    return { success: true };
  } catch {
    throw new UnauthorizedError("Invalid or expired reset token");
  }
};

// ---------- LOGOUT ----------
export const logoutUser = async ({ username }: LogoutPayload) => {
  const user = await authDAO.findUserByUsername(username);
  if (!user) throw new NotFoundError("User not found");

  const success = await authDAO.updateUserLoginStatus(user.Id, 1);
  // await authDAO.revokeAllTokens(user.Id); // optional

  if (!success) throw new ForbiddenError("Failed to logout user");
  return { success: true };
};
