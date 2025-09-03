import { Router } from "express";
import { getMappingQuestionsController, getQuestionsMappingReviewController, updateQuestionsMappingReviewController } from "../controllers/question.controller";

const questionRouter = Router();

questionRouter.get("/getQuestionsMapping", getMappingQuestionsController);
questionRouter.get("/getQuestionsReviewMapping", getQuestionsMappingReviewController);
questionRouter.put("/updateQuestionReviewMapping", updateQuestionsMappingReviewController);



export default questionRouter;
