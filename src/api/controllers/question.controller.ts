import { Request, Response } from "express";
import { QUESTION_MESSAGES } from "../constants/messages";
import { getMappingQuestionsService, getQuestionsMappingReviewService, updateQuestionsMappingReviewService, createQuestionsMappingReviewService } from "../services/question.services";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: number;
      // add other properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

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


export const updateQuestionsMappingReviewController = async (req, res) => {
  try {
    const bodyData = req.body; // { memberType, memberId, langCode, optionData }

    const result = await updateQuestionsMappingReviewService(bodyData);

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in updateQuestionsMappingReviewController:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const createQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    // ✅ Fallback if req.body is undefined
    const body = req.body || {};
    const { memberId, memberType, optionData } = body;

    // ✅ Optional: fallback for createdBy if authentication is not set up
    const createdBy = req.user?.id || 0;

    // ✅ Validate required fields
    if (!memberId || !memberType || !Array.isArray(optionData)) {
      return res.sendError(
        {},
        "Invalid request body: memberId, memberType and optionData are required"
      );
    }

    const result = await createQuestionsMappingReviewService({
      memberId,
      memberType,
      optionData,
      createdBy,
    });

    // ✅ Check service response
    if (!result.success) {
      return res
        .status(result.status)
        .sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
    }

    return res
      .status(result.status)
      .sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    console.error("Error in createQuestionsMappingReviewController:", error);
    return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
  }
};


