import { Request, Response } from "express";
import * as qualificationService from "../services/qualification.service";
import { QUALIFICATION_MESSAGES } from "../constants/messages";

export const getQualifications = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const search = req.query.search ? String(req.query.search) : "";

    const result = await qualificationService.getQualifications(page, limit, search);

    return res.sendSuccess(result, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_FAILED);
  }
};
