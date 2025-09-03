import { Request, Response } from "express";
import { QUESTION_MESSAGES } from "../constants/messages";
import { getMappingQuestionsService, getQuestionsMappingReviewService, updateQuestionsMappingReviewService } from "../services/question.services";

export const getMappingQuestionsController = async (req: Request, res: Response) => {
  try {
    const { memberType, memberId, langCode } = req.query;

    const queryData = {
      memberType: String(memberType),
      memberId: Number(memberId),
      langCode: Number(langCode),
    };

    const result = await getMappingQuestionsService(queryData);

    return res.sendSuccess(result, QUESTION_MESSAGES.QUESTIONS_FETCH_SUCCESS);
  } catch (err: any) {
    console.error("Error in getMappingQuestionsController:", err);
    return res.sendError(err, QUESTION_MESSAGES.QUESTIONS_FETCH_FAILED);
  }
};



export const getQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const { memberType, memberId, langCode } = req.query;
    const queryData = {
      memberType: String(memberType),
      memberId: Number(memberId),
      langCode: Number(langCode),
    };
    const result = await getQuestionsMappingReviewService(queryData);
    return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
  }
};


export const updateQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const { memberId, memberType, optionData } = req.body;

    if (!memberId || !memberType || !Array.isArray(optionData)) {
      return res.sendError({}, "Invalid request body: memberId, memberType and optionData are required");
    }

    const result = await updateQuestionsMappingReviewService({
      memberId,
      memberType,
      optionData,
    });

    return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (err: any) {
    console.error("Error in updateQuestionsMappingReviewController:", err);
    return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
  }
};


