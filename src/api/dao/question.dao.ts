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
        q.text AS questionText,
        q.id AS questionId,
        qm.member_type AS memberType,
        qm.member_id AS memberId,
        qmm.member_question_id AS memberQuestionId,
        qmm.old_member_question_id AS oldMemberQuestionId,
        qual.name AS qualificationName,
        q.language_id AS langCode
      FROM dbo.qualifications_mapping qm
      LEFT JOIN dbo.questions q 
        ON q.id = qm.qualification_id
      LEFT JOIN dbo.qualifications qual 
        ON qual.id = qm.qualification_id
      LEFT JOIN dbo.questions_mapping qmm 
        ON qmm.qualification_id = qm.qualification_id
       AND qmm.member_question_id = q.demographic_id
       AND qmm.member_type = qm.member_type
       AND qmm.member_id = qm.member_id
      WHERE qm.member_type = @memberType
        AND qm.member_id = @memberId
        AND q.language_id = @langCode;
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
        q.id AS questionId,
        q.text AS questionText,
        q.language_id AS langCode,
        qm.member_type AS memberType,
        qm.member_id AS memberId,
        qm.member_qualification_id AS memberQualificationId,
        qm.old_member_qualification_id AS oldMemberQualificationId,
        qmm.member_question_id AS memberQuestionId,
        qmm.old_member_question_id AS oldMemberQuestionId
      FROM dbo.questions q
      LEFT JOIN dbo.questions_mapping qmm
        ON q.id = qmm.question_id
        AND qmm.member_type = @memberType
        AND qmm.member_id = @memberId
      LEFT JOIN dbo.qualifications_mapping qm
        ON qmm.qualification_id = qm.qualification_id
        AND qm.member_type = @memberType
        AND qm.member_id = @memberId
      WHERE q.language_id = @langCode;
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
  memberId: number;
  memberType: string;
  optionData: any[];
}) => {
  try {
    const updatedRows: any[] = [];

    for (const opt of optionData) {
      // Validate required fields
      if (!opt.questionId || !opt.qualificationId) {
        console.warn(`Skipping invalid mapping:`, opt);
        continue; // skip rows with missing required data
      }

      const request = pool.request();
      request.input('memberId', memberId);  
      request.input('memberType', memberType);
      request.input('questionId', opt.questionId);
      request.input('qualificationId', opt.qualificationId);
      request.input('memberQuestionId', opt.memberQuestionId ?? null);
      request.input('oldMemberQuestionId', opt.oldMemberQuestionId ?? null);

      const query = `
        UPDATE dbo.questions_mapping
        SET member_question_id = @memberQuestionId,
            old_member_question_id = @oldMemberQuestionId,
            updated_at = GETDATE()
        WHERE question_id = @questionId
          AND qualification_id = @qualificationId
          AND member_id = @memberId
          AND member_type = @memberType;

        IF @@ROWCOUNT = 0
        BEGIN
          INSERT INTO dbo.questions_mapping
          (question_id, qualification_id, member_id, member_type, member_question_id, old_member_question_id, created_at)
          VALUES (@questionId, @qualificationId, @memberId, @memberType, @memberQuestionId, @oldMemberQuestionId, GETDATE());
        END
      `;

      const result = await request.query(query);
      updatedRows.push(result);
    }

    return updatedRows;
  } catch (error) {
    console.error('Error in updateQuestionsMappingReviewDao:', error);
    throw error;
  }
};
