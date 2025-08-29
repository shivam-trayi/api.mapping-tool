import { pool } from "../../config/database/connection";

// ---------- FIND BY USERNAME ----------
export const findUserByUsername = async (username: string) => {
  const result = await pool
    .request()
    .input("username", username)
    .query(`
      SELECT TOP (1) *
      FROM [staging_gswebsurveys].[dbo].[users]
      WHERE UserName = @username
    `);
  return result.recordset[0];
};

// ---------- FIND BY EMAIL ----------
export const findUserByEmail = async (email: string) => {
  const result = await pool
    .request()
    .input("email", email)
    .query(`
      SELECT TOP (1) *
      FROM [staging_gswebsurveys].[dbo].[users]
      WHERE Email = @email
    `);
  return result.recordset[0];
};

// ---------- FIND BY ID ----------
export const findUserById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT TOP (1) *
      FROM [staging_gswebsurveys].[dbo].[users]
      WHERE Id = @id
    `);
  return result.recordset[0];
};

// ---------- CREATE USER ----------
export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  isActive: number;
  roleId: number;
}) => {
  const result = await pool
    .request()
    .input("username", data.username)
    .input("email", data.email)
    .input("password", data.password)
    .input("isActive", data.isActive)
    .input("roleId", data.roleId)
    .query(`
      INSERT INTO [staging_gswebsurveys].[dbo].[users]
        (UserName, Email, Password, IsActive, UserRoleId, CreatedAt, UpdatedAt)
      OUTPUT INSERTED.*
      VALUES (@username, @email, @password, @isActive, @roleId, GETDATE(), GETDATE())
    `);
  return result.recordset[0];
};

// ---------- UPDATE LOGIN STATUS ----------
export const updateUserLoginStatus = async (userId: number, logoutStatus: 0 | 1) => {
  const result = await pool
    .request()
    .input("userId", userId)
    .input("logoutStatus", logoutStatus)
    .query(`
      UPDATE [staging_gswebsurveys].[dbo].[users]
      SET LogoutUser = @logoutStatus, UpdatedAt = GETDATE()
      WHERE Id = @userId
    `);
  return result.rowsAffected[0] > 0;
};

// ---------- UPDATE PASSWORD ----------
export const updateUserPassword = async (userId: number, newPassword: string) => {
  const result = await pool
    .request()
    .input("userId", userId)
    .input("newPassword", newPassword)
    .query(`
      UPDATE [staging_gswebsurveys].[dbo].[users]
      SET Password = @newPassword, UpdatedAt = GETDATE()
      WHERE Id = @userId
    `);
  return result.rowsAffected[0] > 0;
};

// ---------- RESET TOKEN ----------
export const storeResetToken = async (userId: number, resetToken: string, expiry?: Date) => {
  const req = pool.request().input("userId", userId).input("resetToken", resetToken);
  let query = "";
  if (expiry) {
    req.input("expiry", expiry);
    query = `
      UPDATE [staging_gswebsurveys].[dbo].[users]
      SET ResetToken = @resetToken, ResetTokenExpiresAt = @expiry, UpdatedAt = GETDATE()
      WHERE Id = @userId
    `;
  } else {
    query = `
      UPDATE [staging_gswebsurveys].[dbo].[users]
      SET ResetToken = @resetToken, UpdatedAt = GETDATE()
      WHERE Id = @userId
    `;
  }
  const result = await req.query(query);
  return result.rowsAffected[0] > 0;
};

export const getResetToken = async (userId: number) => {
  const result = await pool
    .request()
    .input("userId", userId)
    .query(`
      SELECT TOP (1) ResetToken, ResetTokenExpiresAt AS Expiry
      FROM [staging_gswebsurveys].[dbo].[users]
      WHERE Id = @userId
    `);
  return result.recordset[0];
};

export const clearResetToken = async (userId: number) => {
  const result = await pool
    .request()
    .input("userId", userId)
    .query(`
      UPDATE [staging_gswebsurveys].[dbo].[users]
      SET ResetToken = NULL, ResetTokenExpiresAt = NULL, UpdatedAt = GETDATE()
      WHERE Id = @userId
    `);
  return result.rowsAffected[0] > 0;
};

// ---------- TOKENS ----------
export const storeLoginToken = async (userId: number, token: string, expiry: Date) => {
  const result = await pool
    .request()
    .input("userId", userId)
    .input("token", token)
    .input("expiry", expiry)
    .query(`
      INSERT INTO [staging_gswebsurveys].[dbo].[user_tokens]
        (UserId, Token, Expiry, IsRevoked, CreatedAt)
      VALUES (@userId, @token, @expiry, 0, GETDATE())
    `);
  return result.rowsAffected[0] > 0;
};

export const revokeAllTokens = async (userId: number) => {
  await pool
    .request()
    .input("userId", userId)
    .query(`
      UPDATE [staging_gswebsurveys].[dbo].[user_tokens]
      SET IsRevoked = 1
      WHERE UserId = @userId AND IsRevoked = 0
    `);
};
