import { pool } from "../../config/database/connection";

/**
 * Get all active clients
 */
export const getAllClients = async () => {
  const result = await pool.request()
    .query(`SELECT id, name FROM [staging_gswebsurveys].[dbo].[clients] WHERE is_active = 1`);
  return result.recordset;
};
