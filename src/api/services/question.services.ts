import { getMappingQuestionsDao, getQuestionsMappingReviewDao, updateQuestionsMappingReviewDao, createQuestionsMappingReviewDao, getAllAnswrsListById, createMappingQuestionDao, updateAnswersMappingDao } from "../dao/question.dao";

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
  memberId: string; 
  memberType: string;
  langCode: number;
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

export const createQuestionsMappingReviewService = async (bodyData: {
  memberId: number;
  memberType: string;
  optionData: any[];
}) => {
  try {
    const result = await createQuestionsMappingReviewDao(bodyData);

    if (!result || !result.success) {
      return { status: 400, success: false, message: result?.message || 'Creation failed', data: [] };
    }

    return {
      status: 200,
      success: true,
      message: result.message,
      data: {
        affectedRows: result.affectedRows,
      },
    };
  } catch (error) {
    console.error("Error in createQuestionsMappingReviewService:", error);
    throw error;
  }
};

export const getAllOptionsById = async (queryData: { memberType: string; memberId: number; langCode: number; questionId: Number }) => {
  try {
    const result = await getAllAnswrsListById(queryData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    console.error("Error in getQuestionsMappingReviewService:", error);
    throw error;
  }
};


export const updateOptionsValueByQID = async (bodyData: {
  memberId: string; 
  memberType: string;
  langCode: number;
  optionData: any[];
}) => {
  try {
    const result = await updateAnswersMappingDao(bodyData);

    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    console.error("Error in updateQuestionsMappingReviewService:", error);
    throw error;
  }
};


export const createMappingQuestionService = async (bodyData: any) => {
  try {
    const result = await createMappingQuestionDao(bodyData);

    if (result && result.success) {
      return { status: 200, success: true, message: result.message };
    }
    return { status: 204, success: false, message: result.message };
  } catch (error) {
    throw error;
  }
};