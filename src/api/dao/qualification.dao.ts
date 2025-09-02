import { pool } from '../../config/database/connection';
import { QualificationsMappingData } from '../interfaces/qualification';

// Get paginated qualifications with search
export const getAllQualifications = async (
  offset: number,
  limit: number,
  search = ''
) => {
  const searchQuery = search
    ? `WHERE name LIKE '%${search.replace("'", "''")}%'`
    : '';
  const result = await pool.request().query(`
    SELECT id, name, is_active
    FROM [staging_gswebsurveys].[dbo].[qualifications]
    ${searchQuery}
    ORDER BY id
    OFFSET ${offset} ROWS
    FETCH NEXT ${limit} ROWS ONLY
  `);
  return result.recordset;
};

// Count total qualifications
export const getQualificationsCount = async (search = '') => {
  const searchQuery = search
    ? `WHERE name LIKE '%${search.replace("'", "''")}%'`
    : '';
  const result = await pool.request().query(`
    SELECT COUNT(*) as total
    FROM [staging_gswebsurveys].[dbo].[qualifications]
    ${searchQuery}
  `);
  return result.recordset[0].total;
};

// Get questions by qualification IDs
export const getQuestionsByQualificationIds = async (
  qualificationIds: number[]
) => {
  if (!qualificationIds.length) return [];
  const ids = qualificationIds.join(',');
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

// Get answers by question IDs
export const getAnswersByQuestionIds = async (questionIds: number[]) => {
  if (!questionIds.length) return [];
  const ids = questionIds.join(',');
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

// Insert into qualifications_mapping table
export const createQualificationsMappingDao = async (
  bodyData: QualificationsMappingData[]
) => {
  try {
    for (const data of bodyData) {
      const {
        qualification_id,
        member_id,
        member_type,
        constantId,
        created_by = null,
        updated_by = null,
        old_member_qualification_id = null,
      } = data;

      const query = `
        IF EXISTS (
          SELECT 1 
          FROM dbo.qualifications_mapping 
          WHERE qualification_id = @qualification_id AND member_id = @member_id
        )
        BEGIN
          UPDATE dbo.qualifications_mapping
          SET 
            member_qualification_id = @member_qualification_id,
            updated_by = @updated_by,
            old_member_qualification_id = @old_member_qualification_id,
            updated_at = GETDATE()
          WHERE qualification_id = @qualification_id AND member_id = @member_id;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.qualifications_mapping
            (qualification_id, member_id, member_type, member_qualification_id, created_at, is_active, created_by, updated_by, old_member_qualification_id)
          VALUES
            (@qualification_id, @member_id, @member_type, @member_qualification_id, GETDATE(), 1, @created_by, @updated_by, @old_member_qualification_id);
        END
      `;

      const request = pool.request();
      request.input('qualification_id', qualification_id);
      request.input('member_id', member_id);
      request.input('member_type', member_type);
      request.input('member_qualification_id', constantId);
      request.input('created_by', created_by ?? 11);
      request.input('updated_by', updated_by ?? 11);
      request.input('old_member_qualification_id', old_member_qualification_id ?? 11);

      await request.query(query);
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};




// Existing DAO methods remain unchanged...

// Get mapping review for a member from qualifications_mapping table
export const getQualificationDemographicsMappingReviewDao = async (queryData: { memberId: number }) => {
  try {
    const { memberId } = queryData;

    if (!memberId) {
      return []; // Return empty if memberId not provided
    }

    const query = `
      SELECT 
        qm.id AS mappingId,
        qm.qualification_id,
        q.name AS qualificationName,
        qm.member_id,
        qm.member_type,
        qm.member_qualification_id,
        qm.created_at,
        qm.is_active
      FROM dbo.qualifications_mapping qm
      LEFT JOIN dbo.qualifications q
        ON q.id = qm.qualification_id
      WHERE qm.member_id = @memberId
      ORDER BY qm.created_at DESC;
    `;

    const request = pool.request();
    request.input('memberId', memberId);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error in getQualificationDemographicsMappingReviewDao:', error);
    throw error;
  }
};

export const saveDemographicsMappingReviewInDB = async (
  bodyData: QualificationsMappingData[]
): Promise<QualificationsMappingData[]> => {
  try {
    const poolConnection = await pool;
    const insertedRows: QualificationsMappingData[] = [];

    for (const row of bodyData) {
      const result = await poolConnection
        .request()
        .input("qualification_id", row.id)
        .input("member_id", row.memberId)
        .input("member_type", row.memberType || 'customer') // default 'customer'
        .input("member_qualification_id", row.constantId || null)
        .input("created_by", row.createdBy || null)
        .input("updated_by", row.updatedBy || null)
        .query(
          `INSERT INTO dbo.review_qualifications_mapping
            (qualification_id, member_id, member_type, member_qualification_id, created_at, created_by, updated_by)
           OUTPUT inserted.id, inserted.qualification_id, inserted.member_id, inserted.member_type, inserted.member_qualification_id, inserted.created_at
           VALUES (@qualification_id, @member_id, @member_type, @member_qualification_id, GETDATE(), @created_by, @updated_by)`
        );

      insertedRows.push(...result.recordset.map(r => ({
        id: r.id,
        qualificationId: r.qualification_id,
        memberId: r.member_id,
        memberType: r.member_type,
        memberQualificationId: r.member_qualification_id,
        createdAt: r.created_at
      })));
    }

    return insertedRows;
  } catch (error) {
    console.error("Error in saveDemographicsMappingReviewInDB:", error);
    throw error;
  }
};
