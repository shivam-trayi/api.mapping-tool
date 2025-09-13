import { Router } from "express";
import {
  getMappingQuestionsController,
  getQuestionsMappingReviewController,
  updateQuestionsMappingReviewController,
  createQuestionsMappingReviewController,
  getAllOptions,
  createMappingQualificationsQuery,
  updateOptionsValue,
  getOptionQueryReviewMappingController,
  updateQuestionsConstantMappingReviewController,
  insertAnswerMappingReviewController,
  updateAnswerMappingReviewController,
} from "../controllers/question.controller";

const questionRouter = Router();

/**
 * -----------------------------
 * Questions Mapping Routes
 * -----------------------------
 */

// Fetch all questions mapping
questionRouter.get("/getQuestionsMapping", getMappingQuestionsController);

// Fetch questions review mapping
questionRouter.get("/getQuestionsReviewMapping", getQuestionsMappingReviewController);

// Update questions review mapping
questionRouter.put("/updateQuestionReviewMapping", updateQuestionsMappingReviewController);

// Create new question review mapping
questionRouter.post("/createQuestionReviewMapping", createQuestionsMappingReviewController);

questionRouter.put("/updateConstantQuestionReviewMapping", updateQuestionsConstantMappingReviewController);


/**
 * -----------------------------
 * Options / Answers Routes
 * -----------------------------
 */

// Fetch options by question ID
questionRouter.get("/getAnswersByQID", getAllOptions);

// Update options by question ID
questionRouter.put("/updateAnswersByQID", updateOptionsValue);
questionRouter.get("/getOptionQueryReviewMapping", getOptionQueryReviewMappingController);
questionRouter.post("/createOptionQueryMapping", insertAnswerMappingReviewController);
questionRouter.put("/updateOptionQueryMapping", updateAnswerMappingReviewController);




/**
 * -----------------------------
 * Qualification / Question Creation
 * -----------------------------
 */

// Create new question mapping / qualification
questionRouter.post("/createQuestionMapping", createMappingQualificationsQuery);

export default questionRouter;
