import { Request, Response } from "express";
import * as qualificationService from "../services/qualification.service";
import { QUALIFICATION_MESSAGES } from "../constants/messages";

export const getQualifications = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const search = req.query.search ? String(req.query.search) : "";

    const result = await qualificationService.getQualifications(page, limit, search);

    return res.sendSuccess(result, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_SUCCESS, 200);
  } catch (err: any) {
    return res.sendError(err, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_FAILED, 500);
  }
};

export const insertQualificationMapping = async (req: Request, res: Response) => {
  try {
    let bodyData = req.body;
    const result =
      await qualificationService.createDemographicsMapping(bodyData);
    return res.sendSuccess(result, QUALIFICATION_MESSAGES.QUALIFICATION_INSERT_SUCCESS, 200);
  } catch (err: any) {
    return res.sendError(err, QUALIFICATION_MESSAGES.QUALIFICATION_INSERT_FAILED, 500);
  }
};

export const getQualificationDemographicsMappingReview = async (req: Request, res: Response) => {
  try {
    const queryData = req.query;
    const result = await qualificationService.getQualificationDemographicsMappingReviewService(queryData);
    return res.sendSuccess(result, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_SUCCESS, 200);
  } catch (err: any) {
    return res.sendError(err, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_FAILED, 500);
  }
};

export const insertQualificationReviewData = async (req: Request, res: Response) => {
  try {
    let bodyData = req.body.bodyData;
    const result =
      await qualificationService.createDemographicsMappingReview(bodyData);
    return res.sendSuccess(result, QUALIFICATION_MESSAGES.QUALIFICATION_INSERT_SUCCESS, 200);
  } catch (err: any) {
    return res.sendError(err, QUALIFICATION_MESSAGES.QUALIFICATION_INSERT_FAILED, 500);
  }
};


export const updateQualificationConstantIdController = async (req: Request, res: Response) => {
  try {
    const { bodyData } = req.body;
    if (!bodyData || !Array.isArray(bodyData)) {
      return res.sendError("Invalid payload");
    }
    const payload = bodyData.map((item: any) => ({
      id: item.id,
      member_qualification_id: Number(item.constantId) || null,
    }));

    const result = await qualificationService.updateQualificationConstantIdService(payload);
    return res.sendSuccess(result, QUALIFICATION_MESSAGES.REVIEW_MAPPING_UPDATE_SUCCESS, 200);
  } catch (error: any) {
    return res.sendError(error, QUALIFICATION_MESSAGES.REVIEW_MAPPING_UPDATE_FAILED, 500);
  }
};

