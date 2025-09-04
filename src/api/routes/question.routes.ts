import { Router } from "express";
import { getMappingQuestionsController, getQuestionsMappingReviewController, updateQuestionsMappingReviewController, createQuestionsMappingReviewController } from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.get("/getQuestionsMapping", getMappingQuestionsController);
questionRouter.get("/getQuestionsReviewMapping", getQuestionsMappingReviewController);
questionRouter.put("/updateQuestionReviewMapping", updateQuestionsMappingReviewController);
questionRouter.post("/createQuestionReviewMapping", createQuestionsMappingReviewController);





export default questionRouter;
