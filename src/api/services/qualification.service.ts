import * as qualificationDao from "../dao/qualification.dao";

export const getQualifications = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const [qualifications, totalCount] = await Promise.all([
    qualificationDao.getAllQualifications(offset, limit),
    qualificationDao.getQualificationsCount(),
  ]);

  const qualificationIds = qualifications.map(q => q.id);

  const questions = qualificationIds.length > 0
    ? await qualificationDao.getQuestionsByQualificationIds(qualificationIds)
    : [];

  const questionIds = questions.map(q => q.id);
  const answers = questionIds.length > 0
    ? await qualificationDao.getAnswersByQuestionIds(questionIds)
    : [];

  // Map questions and answers to qualifications
  const data = qualifications.map((q) => ({
    id: q.id,
    name: q.name,
    isTest: false,
    active: q.is_active === 1,
    questions: questions
      .filter((ques) => ques.demographic_id === q.id)
      .map((ques) => ({
        id: ques.id,
        text: ques.text,
        language: ques.lang_code || "Unknown",
        type: ques.type,
        active: true,
        options: answers
          .filter((ans) => ans.question_id === ques.id)
          .map((ans) => ({
            id: ans.id,
            text: ans.text,
            language: ans.lang_code || "Unknown",
            active: true,
          })),
      })),
  }));

  return {
    data,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
