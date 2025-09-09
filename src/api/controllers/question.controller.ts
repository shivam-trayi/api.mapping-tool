// import { Request, Response } from "express";
// import { QUESTION_MESSAGES } from "../constants/messages";
// import { getMappingQuestionsService, getQuestionsMappingReviewService, updateQuestionsMappingReviewService, createQuestionsMappingReviewService, getAllOptionsById, createMappingQuestionService, updateOptionsValueByQID } from "../services/question.services";

// // Extend Express Request interface to include 'user'
// declare global {
//   namespace Express {
//     interface User {
//       id: number;
//       // add other properties if needed
//     }
//     interface Request {
//       user?: User;
//     }
//   }
// }


// export interface MappingReviewPayload {
//   memberId: number;
//   memberType: string;
//   createdBy?: number;
//   optionData: {
//     questionId: number;
//     qualificationId: number;
//     memberQuestionId?: number | null;
//     qualificationMappingId?: number | null;
//   }[];
// }

// export const getMappingQuestionsController = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode } = req.query;

//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//     };

//     const result = await getMappingQuestionsService(queryData);

//     return res.sendSuccess(result, QUESTION_MESSAGES.QUESTIONS_FETCH_SUCCESS);
//   } catch (err: any) {
//     console.error("Error in getMappingQuestionsController:", err);
//     return res.sendError(err, QUESTION_MESSAGES.QUESTIONS_FETCH_FAILED);
//   }
// };



// export const getQuestionsMappingReviewController = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode } = req.query;
//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//     };
//     const result = await getQuestionsMappingReviewService(queryData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
//   } catch (err: any) {
//     return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
//   }
// };


// export const updateQuestionsMappingReviewController = async (req, res) => {
//   try {
//     const bodyData = req.body; // { memberType, memberId, langCode, optionData }

//     const result = await updateQuestionsMappingReviewService(bodyData);

//     res.status(result.status).json(result);
//   } catch (error) {
//     console.error("Error in updateQuestionsMappingReviewController:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// export const createQuestionsMappingReviewController = async (req: Request, res: Response) => {
//   try {
//     // ✅ Fallback if req.body is undefined
//     const body = req.body || {};
//     const { memberId, memberType, optionData } = body;

//     const result = await createQuestionsMappingReviewService({
//       memberId,
//       memberType,
//       optionData,
//     });

//     // ✅ Check service response
//     if (!result.success) {
//       return res
//         .status(result.status)
//         .sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
//     }

//     return res
//       .status(result.status)
//       .sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
//   } catch (error: any) {
//     console.error("Error in createQuestionsMappingReviewController:", error);
//     return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
//   }
// };

// export const getAllOptions = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode, questionId } = req.query;
//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//       questionId: Number(questionId)
//     };
//     const result = await getAllOptionsById(queryData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
//   } catch (err: any) {
//     return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
//   }
// };


// export const updateOptionsValue = async (req, res) => {
//   try {
//     const bodyData = req.body; // { memberType, memberId, langCode, optionData }

//     const result = await updateOptionsValueByQID(bodyData);

//     res.status(result.status).json(result);
//   } catch (error) {
//     console.error("Error in updateQuestionsMappingReviewController:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// export const createMappingQualificationsQuery = async (req: Request, res: Response) => {
//   try {
//     const bodyData = req.body;

//     const result = await createMappingQuestionService(bodyData);

//     return res.sendSuccess(result, QUESTION_MESSAGES.QUALIFICATION_CREATED_SUCCESS);
//   } catch (err: any) {
//     console.error("Error in createMappingQualificationsQueryController:", err);
//     return res.sendError(err, QUESTION_MESSAGES.QUALIFICATION_CREATED_FAILED);
//   }
// };

// import { Request, Response } from "express";
// import { QUESTION_MESSAGES } from "../constants/messages";
// import {
//   getMappingQuestionsService,
//   getQuestionsMappingReviewService,
//   updateQuestionsMappingReviewService,
//   createQuestionsMappingReviewService,
//   getAllOptionsById,
//   createMappingQuestionService,
//   updateOptionsValueByQID,
// } from "../services/question.services";

// declare global {
//   namespace Express {
//     interface User { id: number }
//     interface Request { user?: User }
//   }
// }

// export const getMappingQuestionsController = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode } = req.query;
//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//     };

//     const result = await getMappingQuestionsService(queryData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.QUESTIONS_FETCH_SUCCESS);
//   } catch (err: any) {
//     console.error("Error in getMappingQuestionsController:", err);
//     return res.sendError(err, QUESTION_MESSAGES.QUESTIONS_FETCH_FAILED);
//   }
// };

// export const getQuestionsMappingReviewController = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode } = req.query;
//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//     };
//     const result = await getQuestionsMappingReviewService(queryData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
//   } catch (err: any) {
//     return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
//   }
// };

// export const updateQuestionsMappingReviewController = async (req: Request, res: Response) => {
//   try {
//     const bodyData = req.body;
//     const result = await updateQuestionsMappingReviewService(bodyData);
//     return res.status(result.status).json(result);
//   } catch (error: any) {
//     console.error("Error in updateQuestionsMappingReviewController:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const createQuestionsMappingReviewController = async (req: Request, res: Response) => {
//   try {
//     const { memberId, memberType, optionData } = req.body || {};
//     const result = await createQuestionsMappingReviewService({ memberId, memberType, optionData });

//     if (!result.success) {
//       return res.status(result.status).sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
//     }

//     return res.status(result.status).sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
//   } catch (error: any) {
//     console.error("Error in createQuestionsMappingReviewController:", error);
//     return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
//   }
// };

// export const getAllOptions = async (req: Request, res: Response) => {
//   try {
//     const { memberType, memberId, langCode, questionId } = req.query;
//     const queryData = {
//       memberType: String(memberType),
//       memberId: Number(memberId),
//       langCode: Number(langCode),
//       questionId: Number(questionId),
//     };
//     const result = await getAllOptionsById(queryData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_SUCCESS);
//   } catch (err: any) {
//     return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
//   }
// };

// export const updateOptionsValue = async (req: Request, res: Response) => {
//   try {
//     const bodyData = req.body;
//     const result = await updateOptionsValueByQID(bodyData);
//     return res.status(result.status).json(result);
//   } catch (error: any) {
//     console.error("Error in updateOptionsValue controller:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const createMappingQualificationsQuery = async (req: Request, res: Response) => {
//   try {
//     const bodyData = req.body;
//     const result = await createMappingQuestionService(bodyData);
//     return res.sendSuccess(result, QUESTION_MESSAGES.QUALIFICATION_CREATED_SUCCESS);
//   } catch (err: any) {
//     console.error("Error in createMappingQualificationsQueryController:", err);
//     return res.sendError(err, QUESTION_MESSAGES.QUALIFICATION_CREATED_FAILED);
//   }
// };


import { Request, Response } from "express";
import { QUESTION_MESSAGES } from "../constants/messages";
import {
  getMappingQuestionsService,
  getQuestionsMappingReviewService,
  updateQuestionsMappingReviewService,
  createQuestionsMappingReviewService,
  getAllOptionsById,
  createMappingQuestionService,
  updateOptionsValueByQID,
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

    const result = await getMappingQuestionsService(queryData);
    return res.sendSuccess(result, QUESTION_MESSAGES.QUESTIONS_FETCH_SUCCESS);
  } catch (err: any) {
    console.error("Error in getMappingQuestionsController:", err.message ?? err);
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
    console.error("Error in getQuestionsMappingReviewController:", err.message ?? err);
    return res.sendError(err, QUESTION_MESSAGES.REVIEW_MAPPING_FETCH_FAILED);
  }
};

export const updateQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await updateQuestionsMappingReviewService(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    console.error("Error in updateQuestionsMappingReviewController:", error.message ?? error);
    return res.sendError(error, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
  }
};

export const createQuestionsMappingReviewController = async (req: Request, res: Response) => {
  try {
    const { memberId, memberType, optionData } = req.body || {};
    const result = await createQuestionsMappingReviewService({ memberId, memberType, optionData });

    if (!result.success) {
      return res.sendError({}, result.message || QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED);
    }

    return res.sendSuccess(result, QUESTION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS);
  } catch (error: any) {
    console.error("Error in createQuestionsMappingReviewController:", error.message ?? error);
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
    console.error("Error in getAllOptions controller:", err.message ?? err);
    return res.sendError(err, QUESTION_MESSAGES.OPTIONS_FETCH_FAILED);
  }
};

export const updateOptionsValue = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await updateOptionsValueByQID(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.OPTIONS_UPDATE_SUCCESS);
  } catch (error: any) {
    console.error("Error in updateOptionsValue controller:", error.message ?? error);
    return res.sendError(error, QUESTION_MESSAGES.OPTIONS_UPDATE_FAILED);
  }
};

export const createMappingQualificationsQuery = async (req: Request, res: Response) => {
  try {
    const bodyData = req.body;
    const result = await createMappingQuestionService(bodyData);
    return res.sendSuccess(result, QUESTION_MESSAGES.QUALIFICATION_CREATED_SUCCESS);
  } catch (err: any) {
    console.error("Error in createMappingQualificationsQueryController:", err.message ?? err);
    return res.sendError(err, QUESTION_MESSAGES.QUALIFICATION_CREATED_FAILED);
  }
};
