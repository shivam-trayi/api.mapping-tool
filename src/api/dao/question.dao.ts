import { pool } from '../../config/database/connection';
import { OPTION_MESSAGES } from '../constants/messages';
import { UpdateConstantMappingReviewDaoPayload } from '../interfaces/qualification';

export const getMappingQuestionsDao = async (queryData: {
  memberType: string;
  memberId: number;
  langCode: number;
}) => {
  try {
    const { memberType, memberId, langCode } = queryData;

    if (!memberType || !memberId || !langCode) {
      return [];
    }

    const query = `
 
  SELECT  
        qu.text AS questionText,
        qu.id AS questionId,
        qmm.member_type AS memberType,
        qmm.member_id AS memberId,
        qmm.member_question_id AS memberQuestionId,
        qmm.old_member_question_id AS oldMemberQuestionId,
        q.id AS qualificationId, 
        q.name AS qualificationName,
        qu.language_id AS langCode
      FROM dbo.qualifications q
      LEFT JOIN dbo.qualifications_mapping qm 
        ON q.id = qm.qualification_id
      LEFT JOIN dbo.questions as qu 
        ON qu.demographic_id = qm.qualification_id
      LEFT JOIN dbo.questions_mapping qmm 
        ON qmm.question_id = qu.id
      WHERE qm.member_type = @memberType
        AND qm.member_id = @memberId
        AND qu.language_id = @langCode;
    `;

    const request = pool.request();
    request.input('memberType', memberType);
    request.input('memberId', memberId);
    request.input('langCode', langCode);

    const result = await request.query(query);

    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const getQuestionsMappingReviewDao = async (queryData: {
  memberType: string;
  memberId: number;
  langCode: number;
}) => {
  try {
    const { memberType, memberId, langCode } = queryData;

    if (!memberType || !memberId || !langCode) {
      return [];
    }

    const query = `

             SELECT  
        qu.text AS questionText,
        qu.id AS questionId,
        q.name as qualificationsname,
        qmm.member_type AS memberType,
        qmm.member_id AS memberId,
        qmm.member_question_id AS memberQuestionId,
        qmm.old_member_question_id AS oldMemberQuestionId,
        q.id AS qualificationId, 
        q.name AS qualificationName,
        qu.language_id AS langCode
      FROM dbo.qualifications q
      LEFT JOIN dbo.qualifications_mapping qm 
        ON q.id = qm.qualification_id
      LEFT JOIN dbo.questions as qu 
        ON qu.demographic_id = qm.qualification_id
      LEFT JOIN dbo.questions_mapping qmm 
        ON qmm.question_id = qu.id
      WHERE qm.member_type = 'customer'
        AND qm.member_id = ${memberId}
        AND qu.language_id = ${langCode}
AND ISNULL(qmm.old_member_question_id, -1) != ISNULL(qmm.member_question_id, -1)
and qmm.isApproved = 0
    `;

    const request = pool.request();
    request.input('memberType', memberType);
    request.input('memberId', memberId);
    request.input('langCode', langCode);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};





export const updateQuestionsMappingReviewDao = async ({
  memberId,
  memberType,
  optionData,
}: {
  memberId: string;
  memberType: string;
  optionData: any[];
}) => {
  try {
    const updatedRows: any[] = [];

    for (const opt of optionData) {
      const questionId = opt.MasterQueryId;
      const qualificationId = opt.MasterDemoId ?? null;
      const memberQuestionId = opt.MemberQueryId || null;

      if (!questionId) {
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("memberType", memberType);
      request.input("questionId", questionId);
      request.input("qualificationId", qualificationId);
      request.input("memberQuestionId", memberQuestionId);
      request.input("isApproved", 0);

      const query = `
IF EXISTS (
    SELECT 1 
    FROM dbo.questions_mapping
    WHERE question_id = @questionId
      AND member_id = @memberId
      AND member_type = @memberType
)
BEGIN
    -- Row exist karta hai, update karo
    UPDATE dbo.questions_mapping
    SET 
        old_member_question_id = member_question_id,
        member_question_id = @memberQuestionId,
        updated_at = GETDATE(),
        isApproved = 0
    WHERE question_id = @questionId
      AND member_id = @memberId
      AND member_type = @memberType;
END
ELSE
BEGIN
    -- Row exist nahi karta, insert karo
    INSERT INTO dbo.questions_mapping
    (question_id, qualification_id, member_id, member_type, member_question_id, old_member_question_id, created_at, isApproved)
    VALUES (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, NULL, GETDATE(), @isApproved);
END

      `;

      const result = await request.query(query);
      updatedRows.push(result.rowsAffected[0] || 0)
    }

    return updatedRows;
  } catch (error) {
    throw error;
  }
};


export const createQuestionsMappingReviewDao = async (bodyData: {
  memberId: number;
  memberType: string;
  optionData: any[];
}) => {
  try {
    const { memberId, optionData } = bodyData;

    if (!optionData || optionData.length === 0) {
      return { success: false, message: "Invalid or empty optionData" };
    }

    const insertedOrUpdated: any[] = [];

    for (const item of optionData) {
      if (!item.questionId || !item.qualificationId) {
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("questionId", item.questionId);
      request.input("qualificationId", item.qualificationId);
      request.input("memberQuestionId", item.memberQuestionId ?? null);
      request.input("createdBy", null);

      // --- Check if row exists in review_questions_mapping ---
      const existsQuery = `
        SELECT COUNT(*) as count
        FROM dbo.review_questions_mapping
        WHERE question_id = @questionId
          AND qualification_id = @qualificationId
          AND member_id = @memberId
      `;
      const existsResult = await request.query(existsQuery);

      if (existsResult.recordset[0].count > 0) {
        // Row exists → update member_question_id
        const updateQuery = `
          UPDATE dbo.review_questions_mapping
          SET member_question_id = @memberQuestionId, created_at = GETDATE()
          WHERE question_id = @questionId
            AND qualification_id = @qualificationId
            AND member_id = @memberId
        `;
        await request.query(updateQuery);
      } else {
        // Row does not exist → insert (original query unchanged)
        const query = `
          INSERT INTO dbo.review_questions_mapping
            (question_id, qualification_id, member_id, member_question_id, created_at, created_by)
          VALUES
            (@questionId, @qualificationId, @memberId, @memberQuestionId, GETDATE(), @createdBy);
        `;
        await request.query(query);
      }

      // --- Also update questions_mapping if needed ---
      const updateQuestionsMappingQuery = `
        UPDATE dbo.questions_mapping
        SET isApproved = 1
        WHERE question_id = @questionId
          AND qualification_id = @qualificationId
          AND member_id = @memberId
          AND member_question_id = @memberQuestionId
      `;
      await request.query(updateQuestionsMappingQuery);

      insertedOrUpdated.push({ questionId: item.questionId, qualificationId: item.qualificationId });
    }

    return {
      success: true,
      message: "Review questions mapping inserted/updated successfully.",
      affectedRows: insertedOrUpdated.length,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllAnswrsListById = async (queryData: {
  memberType: string;
  memberId: number;
  questionId: number;
  langCode: number;
}) => {
  try {
    const { memberType, memberId, questionId, langCode } = queryData;

    if (!memberType || !memberId || !questionId || !langCode) {
      return [];
    }

    const query = `
SELECT 
    q.id AS questionId,
    q.text AS questionText,
    q.language_id AS langCode,
    qual.id AS qualificationId,
    qual.name AS qualificationName,
    ans.id AS answerId,
    ans.text AS answerText,
    am.member_answer_id AS memberAnswerId,
    am.old_member_answer_id AS oldMemberAnswerId
FROM dbo.questions q
INNER JOIN dbo.answers ans 
    ON ans.question_id = q.id
INNER JOIN dbo.qualifications qual
    ON qual.id = ans.demographic_id
INNER JOIN dbo.qualifications_mapping qm
    ON qm.qualification_id = qual.id
       AND qm.member_id = @memberId
       AND qm.member_type = @memberType
LEFT JOIN dbo.answers_mapping am
    ON am.answer_id = ans.id
   AND am.question_id = q.id
   AND am.member_id = @memberId
   AND am.member_type = @memberType
WHERE q.id = @questionId
  AND q.language_id = @langCode
ORDER BY ans.id;


    `;

    const request = pool.request();
    request.input("memberType", memberType);
    request.input("memberId", memberId);
    request.input("questionId", questionId);
    request.input("langCode", langCode);

    const result = await request.query(query);

    // ✅ remove null/undefined fields from response
    const formatted = result.recordset.map(row => {
      const obj: any = {};
      for (const key in row) {
        if (row[key] !== null && row[key] !== undefined) {
          obj[key] = row[key];
        }
      }
      return obj;
    });

    return formatted;
  } catch (error) {
    throw error;
  }
};



interface BodyData {
  memberId: number;
  memberType: string;
  createdBy: number;
  optionData: Array<{
    questionId: number;
    qualificationId: number;
    memberQuestionId?: number;
    qualificationMappingId?: number;
  }>;
}

export const createMappingQuestionDao = async (bodyData: BodyData) => {
  try {
    const { memberId, memberType, createdBy, optionData } = bodyData;

    if (!optionData || optionData.length === 0) {
      return { success: false, message: "No option data provided." };
    }

    const query = `
      INSERT INTO [staging_gswebsurveys].[dbo].[review_questions_mapping]
        (question_id, qualification_id, member_id, member_type, member_question_id, qualification_mapping_id, created_at, created_by)
      VALUES 
        (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, @qualificationMappingId, GETDATE(), @createdBy);
    `;

    const request = pool.request();

    for (const option of optionData) {
      request.input("questionId", option.questionId);
      request.input("qualificationId", option.qualificationId);
      request.input("memberId", memberId);
      request.input("memberType", memberType);
      request.input("memberQuestionId", option.memberQuestionId ?? null);
      request.input("qualificationMappingId", option.qualificationMappingId ?? null);
      request.input("createdBy", createdBy ?? null);

      await request.query(query);
    }

    return { success: true, message: "Qualification mappings inserted successfully." };
  } catch (error) {
    throw error;
  }
};



export const updateAnswersMappingDao = async (bodyData: {
  memberId: number;
  memberType: string;
  questionId: number;
  langCode: number;
  qualificationId: number;
  options: Array<{
    answerId: number;
    constantId: string | number | null;
  }>;
}) => {
  try {
    const { memberId, memberType, questionId, langCode, qualificationId, options } = bodyData;

    if (!options || options.length === 0) {
      return { success: false, message: "No options provided." };
    }

    const results: any[] = [];

    for (const opt of options) {
      if (!opt.answerId) {
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("memberType", 'customer');
      request.input("questionId", questionId);
      request.input("qualificationId", qualificationId);
      request.input("answerId", opt.answerId);
      request.input("memberAnswerId", opt.constantId ?? null);
      request.input("langCode", langCode);

      const query = `
IF EXISTS (
    SELECT 1 FROM dbo.answers_mapping
    WHERE question_id = @questionId
      AND answer_id = @answerId
      AND member_id = @memberId
      AND member_type = @memberType
)
BEGIN
    -- Update the existing row (any isApproved)
    UPDATE dbo.answers_mapping
    SET 
        old_member_answer_id = member_answer_id,
        member_answer_id = @memberAnswerId,
        updated_at = GETDATE(),
        isApproved = 0
    WHERE question_id = @questionId
      AND answer_id = @answerId
      AND member_id = @memberId
      AND member_type = @memberType;
END
ELSE
BEGIN
    INSERT INTO dbo.answers_mapping
        (question_id, answer_id, qualification_id, member_id, member_type, member_answer_id, created_at, isApproved)
    VALUES
        (@questionId, @answerId, @qualificationId, @memberId, @memberType, @memberAnswerId, GETDATE(), 0);
END
`;


      const result = await request.query(query);
      results.push(result);
    }

    return {
      affectedRows: results.length,
    };
  } catch (error) {
    throw error;
  }
};


export const getOptionQueryReviewMappingDao = async (queryData: any) => {
  try {
    let memberId = queryData.memberId;
    let questionId = queryData.questionId;

    if (!memberId || !questionId) {
      return [];
    }

    const query = `
SELECT 
    am.id,
    am.answer_id AS answerId,
    am.question_id AS questionId,
    am.qualification_id AS qualificationId,
    am.member_id AS memberId,
    am.member_type AS memberType,
    am.member_answer_id AS memberAnswerId,
    am.qualification_mapping_id AS qualificationMappingId,
    am.question_mapping_id AS questionMappingId,
    am.created_at,
    am.updated_at,
    am.created_by,
    am.updated_by,
    am.old_member_answer_id AS oldMemberAnswerId,
    a.text AS answerText
FROM dbo.answers_mapping am
LEFT JOIN dbo.answers a
    ON am.answer_id = a.id  -- <-- join on answer_id instead of member_answer_id
WHERE am.member_id = @memberId
  AND am.question_id = @questionId
  AND ISNULL(am.old_member_answer_id, -1) != ISNULL(am.member_answer_id, -1)
  AND am.isApproved = 0;

    `;

    const request = pool.request();
    request.input("memberId", memberId);
    request.input("questionId", questionId);

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};


export const updateQuestionsConstantMappingReviewDao = async (
  bodyData: UpdateConstantMappingReviewDaoPayload
) => {
  const { memberId, memberType, optionData } = bodyData;

  if (!optionData || optionData.length === 0) {
    return { affectedRows: 0, results: [], message: "No options provided." };
  }

  const results: any[] = [];

  try {
    for (const item of optionData) {
      const questionId = Number(item.questionId);
      const memberQuestionId =
        item.memberQuestionId !== null && item.memberQuestionId !== ""
          ? Number(item.memberQuestionId)
          : null;

      if (!questionId || !memberId || !memberType) {
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("memberType", memberType);
      request.input("questionId", questionId);
      request.input("memberQuestionId", memberQuestionId);

      const query = `
        UPDATE [staging_gswebsurveys].[dbo].[questions_mapping]
        SET old_member_question_id = member_question_id,
            member_question_id = @memberQuestionId,
            updated_at = GETDATE()
        WHERE question_id = @questionId
          AND member_id = @memberId
          AND member_type = @memberType;

        IF @@ROWCOUNT = 0
        BEGIN
          INSERT INTO [staging_gswebsurveys].[dbo].[questions_mapping]
            (question_id, member_id, member_type, member_question_id, created_at)
          VALUES
            (@questionId, @memberId, @memberType, @memberQuestionId, GETDATE());
        END
      `;

      try {
        const result = await request.query(query);
        results.push({ questionId, success: true, rowsAffected: result.rowsAffected[0] });
      } catch (sqlError: any) {
        results.push({ questionId, success: false, error: sqlError.message });
      }
    }

    return {
      affectedRows: results.length,
      results,
    };
  } catch (error: any) {
    throw new Error(`DAO failed: ${error.message}`);
  }
};

// export const insertAnswerMappingDao = async (bodyData: any) => {
//   try {
//     const { memberId, memberType, optionData } = bodyData;

//     if (!memberId) {
//       return { success: false, message: "memberId is required" };
//     }

//     if (!optionData || optionData.length === 0) {
//       return { success: false, message: "No option data provided." };
//     }

//     let insertedCount = 0;

//     for (const item of optionData) {
//       const request = pool.request();

//       request.input("answerId", item.answerId);
//       request.input("questionId", item.questionId);
//       request.input("qualificationId", item.qualificationId);
//       request.input("memberId", memberId);
//       request.input("memberType", memberType);
//       request.input("memberAnswerId", item.memberAnswerId ?? item.member_answer_id ?? null);
//       request.input("qualificationMappingId", item.qualificationMappingId ?? null);
//       request.input("questionMappingId", null);
//       request.input("createdBy", 1);
//       request.input("updatedBy", 1);

//       // ✅ Check if row exists first
//       const existsQuery = `
//         SELECT COUNT(*) AS count
//         FROM [staging_gswebsurveys].[dbo].[review_answers_mapping]
//         WHERE answer_id = @answerId
//           AND question_id = @questionId
//           AND qualification_id = @qualificationId
//           AND member_id = @memberId
//           AND member_type = @memberType
//       `;
//       const existsResult = await request.query(existsQuery);

//       if (existsResult.recordset[0].count > 0) {
//         // Row exists → update member_answer_id
//         const updateQuery = `
//           UPDATE [staging_gswebsurveys].[dbo].[review_answers_mapping]
//           SET member_answer_id = @memberAnswerId,
//               updated_at = GETDATE()
//           WHERE answer_id = @answerId
//             AND question_id = @questionId
//             AND qualification_id = @qualificationId
//             AND member_id = @memberId
//             AND member_type = @memberType
//         `;
//         await request.query(updateQuery);
//         insertedCount++;
//       } else {
//         // Row does not exist → insert as-is
//         const insertQuery = `
//           INSERT INTO [staging_gswebsurveys].[dbo].[review_answers_mapping]
//             (
//               answer_id,
//               question_id,
//               qualification_id,
//               member_id,
//               member_type,
//               member_answer_id,
//               qualification_mapping_id,
//               question_mapping_id,
//               created_at,
//               updated_at,
//               created_by,
//               updated_by
//             )
//           VALUES
//             (
//               @answerId,
//               @questionId,
//               @qualificationId,
//               @memberId,
//               @memberType,
//               @memberAnswerId,
//               @qualificationMappingId,
//               @questionMappingId,
//               GETDATE(),
//               GETDATE(),
//               @createdBy,
//               @updatedBy
//             )
//         `;
//         await request.query(insertQuery);
//         insertedCount++;
//       }

//       // ✅ Update answers_mapping exactly as-is
//       const updateResult = await request.query(`
//         UPDATE [staging_gswebsurveys].[dbo].[answers_mapping]
//         SET isApproved = 1,
//             updated_at = GETDATE()
//         WHERE answer_id = @answerId
//           AND question_id = @questionId
//           AND qualification_id = @qualificationId
//           AND member_id = @memberId
//           AND member_type = @memberType
//       `);
//     }

//     if (insertedCount === 0) {
//       return { success: false, message: "Failed to insert/update option review mapping" };
//     }

//     return { success: true, message: "Option review mapping inserted/updated successfully" };
//   } catch (error) {
//     console.error("insertAnswerMappingDao Error:", error);
//     return { success: false, message: "Failed to insert/update option review mapping" };
//   }
// };



export const insertAnswerMappingDao = async (bodyData: any) => {
  try {
    const { memberId, memberType, optionData } = bodyData;

    if (!memberId) {
      return { success: false, message: "memberId is required", affectedRows: 0 };
    }

    if (!optionData || optionData.length === 0) {
      return { success: false, message: "No option data provided.", affectedRows: 0 };
    }

    let affectedRows = 0;

    for (const item of optionData) {
      const request = pool.request();

      request.input("answerId", item.answerId);
      request.input("questionId", item.questionId);
      request.input("qualificationId", item.qualificationId);
      request.input("memberId", memberId);
      request.input("memberType", memberType);
      request.input("memberAnswerId", item.memberAnswerId ?? item.member_answer_id ?? null);
      request.input("qualificationMappingId", item.qualificationMappingId ?? null);
      request.input("questionMappingId", null);
      request.input("createdBy", 1);
      request.input("updatedBy", 1);

      const existsQuery = `
        SELECT COUNT(*) AS count
        FROM [staging_gswebsurveys].[dbo].[review_answers_mapping]
        WHERE answer_id = @answerId
          AND question_id = @questionId
          AND qualification_id = @qualificationId
          AND member_id = @memberId
          AND member_type = @memberType
      `;
      const existsResult = await request.query(existsQuery);

      if (existsResult.recordset[0].count > 0) {
        const updateQuery = `
          UPDATE [staging_gswebsurveys].[dbo].[review_answers_mapping]
          SET member_answer_id = @memberAnswerId,
              updated_at = GETDATE()
          WHERE answer_id = @answerId
            AND question_id = @questionId
            AND qualification_id = @qualificationId
            AND member_id = @memberId
            AND member_type = @memberType
        `;
        await request.query(updateQuery);
        affectedRows++;
      } else {
        const insertQuery = `
          INSERT INTO [staging_gswebsurveys].[dbo].[review_answers_mapping]
            (
              answer_id,
              question_id,
              qualification_id,
              member_id,
              member_type,
              member_answer_id,
              qualification_mapping_id,
              question_mapping_id,
              created_at,
              updated_at,
              created_by,
              updated_by
            )
          VALUES
            (
              @answerId,
              @questionId,
              @qualificationId,
              @memberId,
              @memberType,
              @memberAnswerId,
              @qualificationMappingId,
              @questionMappingId,
              GETDATE(),
              GETDATE(),
              @createdBy,
              @updatedBy
            )
        `;
        await request.query(insertQuery);
        affectedRows++;
      }

      await request.query(`
        UPDATE [staging_gswebsurveys].[dbo].[answers_mapping]
        SET isApproved = 1,
            updated_at = GETDATE()
        WHERE answer_id = @answerId
          AND question_id = @questionId
          AND qualification_id = @qualificationId
          AND member_id = @memberId
          AND member_type = @memberType
      `);
    }

    if (affectedRows === 0) {
      return { success: false, message: "Failed to insert/update option review mapping", affectedRows: 0 };
    }

    return { success: true, message: "Option review mapping inserted/updated successfully", affectedRows };
  } catch (error) {
    return { success: false, message: "Failed to insert/update option review mapping", affectedRows: 0 };
  }
};

export interface UpdateAnswerMappingDaoPayload {
  memberId: number | string;
  memberType: string;
  questionId: number;
  qualificationId: number;
  memberAnswerId: string;
  answerId?: number;
}

export const updateAnswerMappingDao = async (
  bodyData: UpdateAnswerMappingDaoPayload
) => {
  const { memberId, memberType, questionId, qualificationId, memberAnswerId, answerId } = bodyData;

  if (!memberId || !memberType || !questionId || !qualificationId || !memberAnswerId) {
    return { success: false, message: "Missing required fields", rowsAffected: 0 };
  }

  const request = pool.request();
  request.input("memberId", memberId);
  request.input("memberType", memberType);
  request.input("questionId", questionId);
  request.input("qualificationId", qualificationId);
  request.input("answerId", answerId ?? questionId);
  request.input("memberAnswerId", memberAnswerId);

  const query = `
    UPDATE [staging_gswebsurveys].[dbo].[answers_mapping]
    SET 
        old_member_answer_id = member_answer_id,
        member_answer_id = @memberAnswerId,
        updated_at = GETDATE()
    WHERE member_id = @memberId
      AND member_type = @memberType
      AND question_id = @questionId
      AND qualification_id = @qualificationId
      AND answer_id = @answerId;
  `;

  try {
    const result = await request.query(query);
    return {
      success: true,
      rowsAffected: result.rowsAffected[0],
      questionId,
    };
  } catch (error: any) {
    return { success: false, error: error.message, questionId };
  }
};