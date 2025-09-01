import { Request, Response } from "express";
import * as qualificationService from "../services/qualification.service";
import { QUALIFICATION_MESSAGES } from "../constants/messages";

export const getQualifications = async (req: Request, res: Response) => {
  try {
    console.log("🎯 [Controller] Fetching qualifications...");

    // Pagination from query params
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await qualificationService.getQualifications(page, limit);

    console.log("✅ [Controller] Data received from service:", {
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: result.pagination.totalPages,
    });

    return res.sendSuccess(
      result,
      QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_SUCCESS
    );
  } catch (err: any) {
    console.error("❌ [Controller] Error:", err);

    return res.sendError(
      err,
      QUALIFICATION_MESSAGES.QUALIFICATIONS_FETCH_FAILED
    );
  }
};
