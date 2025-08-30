import { Request, Response } from "express";
import * as languageService from "../services/language.service";
import { LANGUAGES_MESSAGES } from "../constants/messages";

/**
 * GET /languages
 */
export const getLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await languageService.getLanguages();
    return res.sendSuccess(languages, LANGUAGES_MESSAGES.LANGUAGES_FETCH_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, LANGUAGES_MESSAGES.LANGUAGES_FETCH_FAILED);
  }
};
