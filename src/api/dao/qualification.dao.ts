import { pool } from "../../config/database/connection";

// ✅ Get paginated qualifications
export const getAllQualifications = async (offset: number, limit: number) => {
  const result = await pool.request().query(`
    SELECT id, name, is_active, created_at, updated_at
    FROM [staging_gswebsurveys].[dbo].[qualifications]
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY
  `);
  return result.recordset;
};

// ✅ Get total qualifications count
export const getQualificationsCount = async () => {
  const result = await pool.request().query(`
    SELECT COUNT(*) as total
    FROM [staging_gswebsurveys].[dbo].[qualifications]
  `);
  return result.recordset[0].total;
};

// ✅ Questions with language code
export const getAllQuestions = async () => {
  const result = await pool.request().query(`
    SELECT q.id, q.demographic_id, q.language_id, q.text, q.type,
           q.global_survey_id, q.kantar_id, q.dynata_id, q.morning_consult_id,
           q.created_at, q.updated_at,
           l.lang_code
    FROM [staging_gswebsurveys].[dbo].[questions] q
    LEFT JOIN [staging_gswebsurveys].[dbo].[language] l
      ON q.language_id = l.id
  `);
  return result.recordset;
};

// ✅ Answers with language (via question → language)
export const getAllAnswers = async () => {
  const result = await pool.request().query(`
    SELECT a.id, a.demographic_id, a.question_id, a.text,
           a.global_survey_id, a.kantar_id, a.dynata_id, a.morning_consult_id,
           a.created_at, a.updated_at,
           l.lang_code
    FROM [staging_gswebsurveys].[dbo].[answers] a
    LEFT JOIN [staging_gswebsurveys].[dbo].[questions] q
      ON a.question_id = q.id
    LEFT JOIN [staging_gswebsurveys].[dbo].[language] l
      ON q.language_id = l.id
  `);
  return result.recordset;
};
