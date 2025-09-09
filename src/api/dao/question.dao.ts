import { pool } from '../../config/database/connection';

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

    console.log('DAO Debug => Rows:', result.recordset.length, ' Params:', {
      memberType,
      memberId,
      langCode,
    });

    return result.recordset;
  } catch (error) {
    console.error('Error in getMappingQuestionsDao:', error);
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
        AND qm.member_id = 3
        AND qu.language_id = 1
AND ISNULL(qmm.old_member_question_id, -1) != ISNULL(qmm.member_question_id, -1)
    `;

    const request = pool.request();
    request.input('memberType', memberType);
    request.input('memberId', memberId);
    request.input('langCode', langCode);

    const result = await request.query(query);

    console.log(
      'DAO Debug (Review) => Rows:',
      result.recordset.length,
      ' Params:',
      { memberType, memberId, langCode }
    );

    return result.recordset;
  } catch (error) {
    console.error('Error in getQuestionsMappingReviewDao:', error);
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
        console.warn("Skipping invalid mapping:", opt);
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("memberType", memberType);
      request.input("questionId", questionId);
      request.input("qualificationId", qualificationId);
      request.input("memberQuestionId", memberQuestionId);

      const query = `
UPDATE dbo.questions_mapping
SET 
    old_member_question_id = member_question_id,
    member_question_id = @memberQuestionId,
    updated_at = GETDATE()
WHERE question_id = @questionId
  AND member_id = @memberId
  AND member_type = @memberType;

IF @@ROWCOUNT = 0
BEGIN
  INSERT INTO dbo.questions_mapping
  (question_id, qualification_id, member_id, member_type, member_question_id, old_member_question_id, created_at)
  VALUES (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, NULL, GETDATE());
END



      `;

      const result = await request.query(query);
      updatedRows.push(result);
    }

    return updatedRows;
  } catch (error) {
    console.error("Error in updateQuestionsMappingReviewDao:", error);
    throw error;
  }
};


export const createQuestionsMappingReviewDao = async (bodyData: {
  memberId: number;
  memberType: string; // 👈 ye param aa raha hai but table me nahi hai
  optionData: any[];
}) => {
  try {
    const { memberId, optionData } = bodyData;

    if (!optionData || optionData.length === 0) {
      return { success: false, message: "Invalid or empty optionData" };
    }

    const inserted: any[] = [];

    for (const item of optionData) {
      if (!item.questionId || !item.qualificationId) {
        console.warn("Skipping invalid item:", item);
        continue;
      }

      const request = pool.request();
      request.input("memberId", memberId);
      request.input("questionId", item.questionId);
      request.input("qualificationId", item.qualificationId);
      request.input("memberQuestionId", item.memberQuestionId ?? null);
      request.input("createdBy", null);

      const query = `
        INSERT INTO dbo.review_questions_mapping
          (question_id, qualification_id, member_id, member_question_id, created_at, created_by)
        VALUES
          (@questionId, @qualificationId, @memberId, @memberQuestionId, GETDATE(), @createdBy);
      `;

      const result = await request.query(query);
      inserted.push(result);
    }

    return {
      success: true,
      message: "Review questions mapping inserted successfully.",
      affectedRows: inserted.length,
    };
  } catch (error) {
    console.error("Error in createQuestionsMappingReviewDao:", error);
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
        am.member_answer_id,
        am.old_member_answer_id
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

    console.log("DAO Debug (Answers by Question) =>", result.recordset.length, "rows", {
      memberType,
      memberId,
      questionId,
      langCode,
    });

    return result.recordset;
  } catch (error) {
    console.error("Error in getAnswersByQuestion:", error);
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
    console.error("Error in createMappingQualificationsDemoQueryDao:", error);
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
        console.warn("Skipping invalid option:", opt);
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
          UPDATE dbo.answers_mapping
          SET old_member_answer_id = member_answer_id, 
        member_answer_id = @memberAnswerId, 
              updated_at = GETDATE()
          WHERE question_id = @questionId
            AND answer_id = @answerId
            AND member_id = @memberId
            AND member_type = @memberType;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.answers_mapping
            (question_id, answer_id, qualification_id, member_id, member_type, member_answer_id, created_at)
          VALUES
            (@questionId, @answerId, @qualificationId, @memberId, @memberType, @memberAnswerId, GETDATE());
        END
      `;

      const result = await request.query(query);
      results.push(result);
    }

    return {
      success: true,
      message: "Answers mapping inserted/updated successfully.",
      affectedRows: results.length,
    };
  } catch (error) {
    console.error("Error in updateAnswersMappingDao:", error);
    throw error;
  }
};
