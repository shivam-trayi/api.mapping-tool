import * as qualificationDao from "../dao/qualification.dao";
import { CreateMappingResponse, QualificationsMappingData, UpdateQualificationConstantPayload, } from "../interfaces/qualification";

export const getQualifications = async (page = 1, limit = 10, search = "") => {
  const offset = (page - 1) * limit;

  const [qualifications, totalCount] = await Promise.all([
    qualificationDao.getAllQualifications(offset, limit, search),
    qualificationDao.getQualificationsCount(search),
  ]);

  const qualificationIds = qualifications.map(q => q.id);

  const questions = qualificationIds.length > 0
    ? await qualificationDao.getQuestionsByQualificationIds(qualificationIds)
    : [];

  const questionIds = questions.map(q => q.id);

  const answers = questionIds.length > 0
    ? await qualificationDao.getAnswersByQuestionIds(questionIds)
    : [];

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

export const createDemographicsMapping = async (
  bodyData: QualificationsMappingData[]
): Promise<CreateMappingResponse> => {
  try {
    await qualificationDao.createQualificationsMappingDao(bodyData);
    return { status: 200, success: true };
  } catch (error) {
    return { status: 500, success: false };
  }
};


export const getQualificationDemographicsMappingReviewService = async (queryData: any) => {
  try {
    const result = await qualificationDao.getQualificationDemographicsMappingReviewDao(queryData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    throw error;
  }
};


export const createDemographicsMappingReview = async (
  bodyData: QualificationsMappingData[]
): Promise<CreateMappingResponse> => {
  try {
    await qualificationDao.saveDemographicsMappingReviewInDB(bodyData);

    return { status: 200, success: true };
  } catch (error) {
    return { status: 500, success: false };
  }
};


export const updateQualificationConstantIdService = async (
  payload: UpdateQualificationConstantPayload[]
) => {
  if (!payload || payload.length === 0) {
    throw new Error("No qualifications provided");
  }

  return await qualificationDao.updateQualificationConstantIdDao(payload);
};
