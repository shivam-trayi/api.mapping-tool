import { Router } from "express";
import { getMappingQuestionsController, getQuestionsMappingReviewController, updateQuestionsMappingReviewController, createQuestionsMappingReviewController, getAllOptions, createMappingQualificationsQuery, updateOptionsValue } from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.get("/getQuestionsMapping", getMappingQuestionsController);
questionRouter.get("/getQuestionsReviewMapping", getQuestionsMappingReviewController);
questionRouter.put("/updateQuestionReviewMapping", updateQuestionsMappingReviewController);
questionRouter.post("/createQuestionReviewMapping", createQuestionsMappingReviewController);
questionRouter.get("/getAnswersByQID", getAllOptions);
questionRouter.put("/updateAnswersByQID", updateOptionsValue);


questionRouter.post("/createQuestionMapping",createMappingQualificationsQuery);





export default questionRouter;
