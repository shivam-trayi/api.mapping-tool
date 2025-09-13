import { pool } from '../../config/database/connection';
import { QualificationsMappingData, UpdateQualificationConstantPayload } from '../interfaces/qualification';

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
      } = data;

      const existingQuery = `
        SELECT TOP 1 member_qualification_id 
        FROM dbo.qualifications_mapping
        WHERE qualification_id = @qualification_id 
          AND member_id = @member_id
      `;

      const existingReq = pool.request();
      existingReq.input("qualification_id", qualification_id);
      existingReq.input("member_id", member_id);
      const existingResult = await existingReq.query(existingQuery);

      let oldMappedId: number | null = null;
      if (existingResult.recordset.length > 0) {
        oldMappedId = existingResult.recordset[0].member_qualification_id;
      }

      // Step 2: Insert/Update Query
      const query = `
        IF EXISTS (
          SELECT 1 
          FROM dbo.qualifications_mapping 
          WHERE qualification_id = @qualification_id AND member_id = @member_id
        )
        BEGIN
          UPDATE dbo.qualifications_mapping
          SET 
            old_member_qualification_id = @old_member_qualification_id,
            member_qualification_id = @member_qualification_id,
            updated_by = @updated_by,
            updated_at = GETDATE()
          WHERE qualification_id = @qualification_id AND member_id = @member_id;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.qualifications_mapping
            (qualification_id, member_id, member_type, member_qualification_id, old_member_qualification_id, created_at, is_active, created_by, updated_by)
          VALUES
            (@qualification_id, @member_id, @member_type, @member_qualification_id, @old_member_qualification_id, GETDATE(), 1, @created_by, @updated_by);
        END
      `;

      const request = pool.request();
      request.input("qualification_id", qualification_id);
      request.input("member_id", member_id);
      request.input("member_type", member_type);
      request.input("member_qualification_id", constantId);
      request.input("old_member_qualification_id", oldMappedId);
      request.input("created_by", created_by ?? 11);
      request.input("updated_by", updated_by ?? 11);

      await request.query(query);
    }

    return { success: true };
  } catch (error) {
    console.error("Error in createQualificationsMappingDao:", error);
    throw error;
  }
};


// Get mapping review for a member from qualifications_mapping table
// export const getQualificationDemographicsMappingReviewDao = async (queryData: {
//   memberId: number;
// }) => {
//   try {
//     const { memberId } = queryData;

//     if (!memberId) {
//       return [];
//     }

//     const query = `
//       SELECT 
//         qm.id AS mappingId,
//         qm.qualification_id,
//         q.name AS qualificationName,
//         qm.member_id,
//         qm.member_type,
//         qm.member_qualification_id,
//         qm.old_member_qualification_id, -- add this
//         qm.created_at,
//         qm.is_active
//       FROM dbo.qualifications_mapping qm
//       LEFT JOIN dbo.qualifications q
//         ON q.id = qm.qualification_id
//       WHERE qm.member_id = @memberId
//       ORDER BY qm.created_at DESC;
//     `;

//     const request = pool.request();
//     request.input('memberId', memberId);

//     const result = await request.query(query);
//     return result.recordset;
//   } catch (error) {
//     console.error('Error in getQualificationDemographicsMappingReviewDao:', error);
//     throw error;
//   }
// };
export const getQualificationDemographicsMappingReviewDao = async (queryData: { memberId: number }) => {
  try {
    const { memberId } = queryData;
    const request = pool.request();

    if (Number(memberId) === 0) {
      const query = `
        SELECT 
          q.id AS qualification_id,
          q.name AS qualificationName,
          q.is_active,
          q.created_at,
          q.updated_at,
          NULL AS mappingId,
          0 AS member_id,
          NULL AS member_type,
          NULL AS member_qualification_id,
          NULL AS old_member_qualification_id,
          NULL AS mapping_created_at,
          NULL AS mapping_is_active
        FROM dbo.qualifications q
        ORDER BY q.created_at DESC;
      `;
      const result = await request.query(query);
      return result.recordset;
    } else {
      const query = `
        SELECT 
          q.id AS qualification_id,
          q.name AS qualificationName,
          q.is_active AS qualificationIsActive,
          q.created_at AS qualificationCreatedAt,
          q.updated_at AS qualificationUpdatedAt,

          qm.id AS mappingId,
          qm.member_id,
          qm.member_type,
          qm.qualification_id AS mappingQualificationId,
          qm.member_qualification_id,
          qm.old_member_qualification_id,
          qm.created_at AS mappingCreatedAt,
          qm.is_active AS mappingIsActive

        FROM dbo.qualifications q
        LEFT JOIN dbo.qualifications_mapping qm
          ON q.id = qm.qualification_id AND qm.member_id = @memberId
        ORDER BY 
          CASE WHEN qm.id IS NOT NULL THEN 0 ELSE 1 END,
          q.created_at DESC;
      `;
      request.input('memberId', memberId);
      const result = await request.query(query);
      return result.recordset;
    }
  } catch (error) {
    console.error('Error in getQualificationDemographicsMappingReviewDao:', error);
    throw error;
  }
};



export const saveDemographicsMappingReviewInDB = async (
  bodyData: QualificationsMappingData[]
): Promise<QualificationsMappingData[]> => {
  try {
       const poolConnection = await pool
    const insertedRows: QualificationsMappingData[] = [];

    for (const row of bodyData) {
      const result = await poolConnection
        .request()
        .input('qualification_id', row.qualification_id)
        .input('member_id', row.member_id)
        .input('member_type', row.member_type || 'customer')
        .input(
          'member_qualification_id',
          row.member_qualification_id || row.constantId || null
        )
        .input('created_by', row.created_by || null)
        .input('updated_by', row.updated_by || null)
        .query(
          `INSERT INTO dbo.review_qualifications_mapping
            (qualification_id, member_id, member_type, member_qualification_id, created_at, created_by, updated_by)
           OUTPUT inserted.qualification_id, inserted.member_id, inserted.member_type, inserted.member_qualification_id, inserted.created_at
           VALUES (@qualification_id, @member_id, @member_type, @member_qualification_id, GETDATE(), @created_by, @updated_by)`
        );

      insertedRows.push(
        ...result.recordset.map((r) => ({
          qualification_id: r.qualification_id,
          member_id: r.member_id,
          member_type: r.member_type,
          member_qualification_id: r.member_qualification_id,
          created_by: row.created_by ?? undefined,
          updated_by: row.updated_by ?? undefined,
          old_member_qualification_id:
            row.old_member_qualification_id ?? undefined,
          constantId: row.constantId,
        }))
      );
    }

    return insertedRows;
  } catch (error) {
    console.error('Error in saveDemographicsMappingReviewInDB:', error);
    throw error;
  }
};


export const updateQualificationConstantIdDao = async (
  payload: UpdateQualificationConstantPayload[]
) => {
  const results: any[] = [];

  for (const item of payload) {
    const { id, member_qualification_id } = item;

    if (!id) {
      results.push({ id, success: false, error: "Invalid data" });
      continue;
    }

    try {
      const request = pool.request();
      request.input("id", id);
      request.input("member_qualification_id", member_qualification_id);

      const query = `
        UPDATE [staging_gswebsurveys].[dbo].[qualifications_mapping]
        SET member_qualification_id = @member_qualification_id,
            updated_at = GETDATE()
        WHERE id = @id;
      `;

      const result = await request.query(query);

      results.push({
        id,
        success: true,
        rowsAffected: result.rowsAffected[0] ?? 0
      });
    } catch (error: any) {
      results.push({
        id,
        success: false,
        error: error.message
      });
    }
  }

  return {
    success: true,
    message: "Member qualification IDs updated successfully.",
    affectedRows: results.length,
    results
  };
};
