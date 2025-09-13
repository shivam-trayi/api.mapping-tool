import { Request, Response } from "express";
import { OPTION_MESSAGES, QUESTION_MESSAGES } from "../constants/messages";
import {
  getMappingQuestionsService,
  getQuestionsMappingReviewService,
  updateQuestionsMappingReviewService,
  createQuestionsMappingReviewService,
  getAllOptionsById,
  createMappingQuestionService,
  updateOptionsValueByQID,
  getOptionQueryReviewMappingService,
  updateQuestionsConstantMappingReviewService,
  insertAnswerMappingService,
  updateAnswerMappingService,
} from "../services/question.services";

declare global {
  namespace Express {
    interface User { id: number }
    interface Request { user?: User }
  }
}

// ------------------- Controllers -------------------

export const getMappingQuestionsController = async (req: Request, res: Response) => {
  try {
    const { memberType, memberId, langCode } = req.query;
    const queryData = {
      memberType: String(memberType),
      memberId: Number(memberId),
      langCode: Number(langCode),
    };

    // const result = await getMappingQuestionsService(queryData);
    const result = await getMappingQuestionsService(queryData);
    return res.sendSuccess(
      { data: result.data, status: result.status, success: result.success },
      QUESTION_MESSAGES.QUESTIONS_FETCH_SUCCESS
    );
  } catch (err: any) {
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

    // const result = await getQuestionsMappingReviewService(queryData);
    // return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
    const result = await getQuestionsMappingReviewService(queryData);
    return res.sendSuccess(
      { data: result.data, status: result.status, success: result.success },
      QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS
    );
  } catch (err: any) {
    return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
  }
};

export const updateQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await updateQuestionsMappingReviewService(bodyData);
    // return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);

    return res.sendSuccess(
      { data: result.data, status: result.status, success: result.success },
      QUESTION_MESSAGES.QUALIFICATION_MAPPING_UPDATE_SUCCESS
    );
  } catch (error: any) {
    return res.sendError(error, QUESTION_MESSAGES.QUALIFICATION_MAPPING_UPDATE_FAILED);
  }
};

export const createQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const { memberId, memberType, optionData } = req.body || {};
    const result = await createQuestionsMappingReviewService({ memberId, memberType, optionData });

    // if (!result.success) {
    //   return res.sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
    // }

    // return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
    if (!result.success) {
      return res.sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
    }

    return res.sendSuccess(
      { data: result.data, status: result.status, success: result.success },
      QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS
    );
  } catch (error: any) {
    return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
  }
};


export const getAllOptions = async (req: Request, res: Response) => {
  try {
    const { memberType, memberId, langCode, questionId } = req.query;
    const queryData = {
      memberType: String(memberType),
      memberId: Number(memberId),
      langCode: Number(langCode),
      questionId: Number(questionId),
    };

    const result = await getAllOptionsById(queryData);
    return res.sendSuccess(result, QUESTION_MESSAGES.OPTIONS_FETCH_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, QUESTION_MESSAGES.OPTIONS_FETCH_FAILED);
  }
};

export const updateOptionsValue = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await updateOptionsValueByQID(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.OPTIONS_UPDATE_SUCCESS);
  } catch (error: any) {
    return res.sendError(error, QUESTION_MESSAGES.OPTIONS_UPDATE_FAILED);
  }
};

export const createMappingQualificationsQuery = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await createMappingQuestionService(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.QUALIFICATION_CREATED_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, QUESTION_MESSAGES.QUALIFICATION_CREATED_FAILED);
  }
};


export const getOptionQueryReviewMappingController = async (req: Request, res: Response) => {
  try {
    const queryData = req.query;

    const result = await getOptionQueryReviewMappingService(queryData);

    return res.sendSuccess(result, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_FETCH_SUCCESS);
  } catch (error: any) {
    return res.sendError(error, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_FETCH_FAILED);
  }
};



export const updateQuestionsConstantMappingReviewController = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await updateQuestionsConstantMappingReviewService(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
  }
};


export const insertAnswerMappingReviewController = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;

    const result = await insertAnswerMappingService(bodyData);

    return res.sendSuccess(result, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    return res.sendError(error, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_UPDATE_FAILED);
  }
};


export const updateAnswerMappingReviewController = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;

    const result = await updateAnswerMappingService(bodyData);

    return res.sendSuccess(result, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    return res.sendError(error, OPTION_MESSAGES.OPTION_REVIEW_MAPPING_UPDATE_FAILED);
  }
};