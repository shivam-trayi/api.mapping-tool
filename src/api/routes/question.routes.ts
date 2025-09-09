// import { Router } from "express";
// import { getMappingQuestionsController, getQuestionsMappingReviewController, updateQuestionsMappingReviewController, createQuestionsMappingReviewController, getAllOptions, createMappingQualificationsQuery, updateOptionsValue } from "../controllers/question.controller";

// const questionRouter = Router();

// questionRouter.get("/getQuestionsMapping", getMappingQuestionsController);
// questionRouter.get("/getQuestionsReviewMapping", getQuestionsMappingReviewController);
// questionRouter.put("/updateQuestionReviewMapping", updateQuestionsMappingReviewController);
// questionRouter.post("/createQuestionReviewMapping", createQuestionsMappingReviewController);
// questionRouter.get("/getAnswersByQID", getAllOptions);
// questionRouter.put("/updateAnswersByQID", updateOptionsValue);
// questionRouter.post("/createQuestionMapping", createMappingQualificationsQuery);


// export default questionRouter;


import { Router } from "express";
import {
  getMappingQuestionsController,
  getQuestionsMappingReviewController,
  updateQuestionsMappingReviewController,
  createQuestionsMappingReviewController,
  getAllOptions,
  createMappingQualificationsQuery,
  updateOptionsValue,
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

/**
 * -----------------------------
 * Options / Answers Routes
 * -----------------------------
 */

// Fetch options by question ID
questionRouter.get("/getAnswersByQID", getAllOptions);

// Update options by question ID
questionRouter.put("/updateAnswersByQID", updateOptionsValue);

/**
 * -----------------------------
 * Qualification / Question Creation
 * -----------------------------
 */

// Create new question mapping / qualification
questionRouter.post("/createQuestionMapping", createMappingQualificationsQuery);

export default questionRouter;
