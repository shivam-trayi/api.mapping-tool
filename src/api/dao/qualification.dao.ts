import { pool } from "../../config/database/connection";

// ✅ Get paginated qualifications
export const getAllQualifications = async (offset: number, limit: number) => {
  const result = await pool.request().query(`
    SELECT id, name, is_active
    FROM [staging_gswebsurveys].[dbo].[qualifications]
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY
  `);
  return result.recordset;
};

// ✅ Total qualifications count
export const getQualificationsCount = async () => {
  const result = await pool.request().query(`
    SELECT COUNT(*) as total
    FROM [staging_gswebsurveys].[dbo].[qualifications]
  `);
  return result.recordset[0].total;
};

// ✅ Questions only for current page qualifications
export const getQuestionsByQualificationIds = async (qualificationIds: number[]) => {
  if (!qualificationIds.length) return [];
  const ids = qualificationIds.join(",");
  const result = await pool.request().query(`
    SELECT q.id, q.demographic_id, q.language_id, q.text, q.type,
           l.lang_code
    FROM [staging_gswebsurveys].[dbo].[questions] q
    LEFT JOIN [staging_gswebsurveys].[dbo].[language] l
      ON q.language_id = l.id
    WHERE q.demographic_id IN (${ids})
  `);
  return result.recordset;
};

// ✅ Answers only for current page questions
export const getAnswersByQuestionIds = async (questionIds: number[]) => {
  if (!questionIds.length) return [];
  const ids = questionIds.join(",");
  const result = await pool.request().query(`
    SELECT a.id, a.question_id, a.text,
           l.lang_code
    FROM [staging_gswebsurveys].[dbo].[answers] a
    LEFT JOIN [staging_gswebsurveys].[dbo].[questions] q
      ON a.question_id = q.id
    LEFT JOIN [staging_gswebsurveys].[dbo].[language] l
      ON q.language_id = l.id
    WHERE a.question_id IN (${ids})
  `);
  return result.recordset;
};
