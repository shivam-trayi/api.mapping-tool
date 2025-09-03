import { getMappingQuestionsDao, getQuestionsMappingReviewDao, updateQuestionsMappingReviewDao } from "../dao/question.dao";

export const getMappingQuestionsService = async (queryData: { memberType: string; memberId: number; langCode: number }) => {
  try {
    const result = await getMappingQuestionsDao(queryData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    console.error("Error in getMappingQuestionsService:", error);
    throw error;
  }
};


export const getQuestionsMappingReviewService = async (queryData: { memberType: string; memberId: number; langCode: number }) => {
  try {
    const result = await getQuestionsMappingReviewDao(queryData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    console.error("Error in getQuestionsMappingReviewService:", error);
    throw error;
  }
};




export const updateQuestionsMappingReviewService = async (bodyData: {
  memberId: number;
  memberType: string;
  optionData: any[];
}) => {
  try {
    const result = await updateQuestionsMappingReviewDao(bodyData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    console.error("Error in updateQuestionsMappingReviewService:", error);
    throw error;
  }
};

