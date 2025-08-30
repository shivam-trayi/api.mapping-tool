import { pool } from "../../config/database/connection";

/**
 * Get all active languages
 */
export const getAllLanguages = async () => {
  const result = await pool.request()
    .query(`SELECT id, name, lang_code FROM [staging_gswebsurveys].[dbo].[language] WHERE is_active = 1`);
  return result.recordset;
};
