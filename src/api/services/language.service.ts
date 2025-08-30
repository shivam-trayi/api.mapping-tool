import * as languageDAO from "../dao/language.dao";
import {
  NotFoundError,
  ServiceError,
} from "../../errors/appError";

/**
 * Fetch all languages
 */
export const getLanguages = async () => {
  try {
    const languages = await languageDAO.getAllLanguages();

    if (!languages || languages.length === 0) {
      throw new NotFoundError("No languages found");
    }

    return languages;
  } catch (err: any) {
    throw new ServiceError("Failed to fetch languages");
  }
};
