import {
  getMappingQuestionsDao,
  getQuestionsMappingReviewDao,
  updateQuestionsMappingReviewDao,
  createQuestionsMappingReviewDao,
  getAllAnswrsListById,
  createMappingQuestionDao,
  updateAnswersMappingDao,
  getOptionQueryReviewMappingDao,
  updateQuestionsConstantMappingReviewDao,
} from "../dao/question.dao";
import { UpdateConstantMappingReviewDaoPayload, UpdateConstantMappingReviewPayload } from "../interfaces/qualification";

// --------------------- Services ---------------------

export const getMappingQuestionsService = async (queryData: { memberType: string; memberId: number; langCode: number }) => {
  try {
    const result = await getMappingQuestionsDao(queryData);
    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }
    return { status: 200, success: true, data: result };
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    throw error;
  }
};

export const getAllOptionsById = async (queryData: { memberType: string; memberId: number; langCode: number; questionId: number }) => {
  try {
    const result = await getAllAnswrsListById(queryData);
    if (!result || result.length === 0) {
      return { status: 404, success: false, data: [] };
    }
    return { status: 200, success: true, data: result };
  } catch (error: any) {
    throw error;
  }
};

export const updateOptionsValueByQID = async (bodyData: {
  memberId: number;
  memberType: string;
  questionId: number;
  langCode: number;
  qualificationId: number;
  options: { answerId: number; constantId: string | number | null; }[];
}) => {
  try {
    const result = await updateAnswersMappingDao(bodyData);
    if (!result) {
      return { status: 404, success: false, data: [], message: "Update failed" };
    }
    return { status: 200, success: true, data: result };
  } catch (error: any) {
    throw error;
  }
};

export const createMappingQuestionService = async (bodyData: any) => {
  try {
    const result = await createMappingQuestionDao(bodyData);
    if (!result || !result.success) {
      return { status: 204, success: false, message: result?.message ?? "Creation failed" };
    }
    return { status: 200, success: true, message: result.message };
  } catch (error: any) {
    throw error;
  }
};

export const getOptionQueryReviewMappingService = async (queryData: any) => {
  try {
    const result = await getOptionQueryReviewMappingDao(queryData);

    if (!result || result.length === 0) {
      return { status: 204, success: false, data: [] };
    }

    return { status: 200, success: true, data: result };
  } catch (error) {
    throw error;
  }
};



export const updateQuestionsConstantMappingReviewService = async (
  bodyData: UpdateConstantMappingReviewPayload
) => {
  try {
    if (!bodyData.optionData || bodyData.optionData.length === 0) {
      throw new Error("No options provided");
    }

    const daoPayload: UpdateConstantMappingReviewDaoPayload = {
      memberId: bodyData.memberId,
      memberType: bodyData.memberType,
      optionData: bodyData.optionData.map((o) => ({
        questionId: Number(o.questionId),
        memberQuestionId:
          o.memberQuestionId !== undefined && o.memberQuestionId !== null
            ? Number(o.memberQuestionId)
            : null,
      })),
    };

    const result = await updateQuestionsConstantMappingReviewDao(daoPayload);

    if (!result) {
      return { status: 404, success: false, data: [], message: "Update failed" };
    }

    return { status: 200, success: true, data: result };
  } catch (error: any) {
    throw error;
  }
};
