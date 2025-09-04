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
      // map frontend keys → db keys
      const questionId = opt.MasterQueryId;
      const qualificationId = opt.MasterDemoId ?? null; // अगर भेजना है
      const memberQuestionId = opt.MemberQueryId || null;

      // अगर questionId missing है तो skip
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
        SET member_question_id = @memberQuestionId,
            updated_at = GETDATE()
        WHERE question_id = @questionId
          AND member_id = @memberId
          AND member_type = @memberType;

        IF @@ROWCOUNT = 0
        BEGIN
          INSERT INTO dbo.questions_mapping
          (question_id, qualification_id, member_id, member_type, member_question_id, created_at)
          VALUES (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, GETDATE());
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
  memberType: string;
  optionData: any[];
  createdBy: number;
}) => {
  try {
    const { memberId, memberType, optionData, createdBy } = bodyData;

    if (!optionData || optionData.length === 0) {
      return { success: false, message: 'Invalid or empty optionData' };
    }

    const insertedOrUpdated: any[] = [];

    for (const item of optionData) {
      if (!item.questionId || !item.qualificationId) {
        console.warn(`Skipping invalid item:`, item);
        continue;
      }

      const request = pool.request();
      request.input('memberId', memberId);
      request.input('memberType', memberType);
      request.input('questionId', item.questionId);
      request.input('qualificationId', item.qualificationId);
      request.input('memberQuestionId', item.memberQuestionId ?? null);
      request.input('oldMemberQuestionId', item.oldMemberQuestionId ?? null);
      request.input('createdBy', createdBy);

      const query = `
        IF EXISTS (
          SELECT 1 FROM dbo.questions_mapping
          WHERE question_id = @questionId
            AND qualification_id = @qualificationId
            AND member_id = @memberId
            AND member_type = @memberType
        )
        BEGIN
          UPDATE dbo.questions_mapping
          SET member_question_id = @memberQuestionId,
              old_member_question_id = @oldMemberQuestionId,
              updated_at = GETDATE()
          WHERE question_id = @questionId
            AND qualification_id = @qualificationId
            AND member_id = @memberId
            AND member_type = @memberType;
        END
        ELSE
        BEGIN
          INSERT INTO dbo.questions_mapping
            (question_id, qualification_id, member_id, member_type, member_question_id, old_member_question_id, created_at, created_by)
          VALUES
            (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, @oldMemberQuestionId, GETDATE(), @createdBy);
        END
      `;

      const result = await request.query(query);
      insertedOrUpdated.push(result);
    }

    return {
      success: true,
      message: 'Questions mapping inserted/updated successfully.',
      affectedRows: insertedOrUpdated.length,
    };
  } catch (error) {
    console.error('Error in createQuestionsMappingReviewDao:', error);
    throw error;
  }
};

