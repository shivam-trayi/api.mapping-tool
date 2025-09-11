import { Router } from "express";
import * as qualificationController from "../controllers/qualification.controller";

const qualificationRouter = Router();

qualificationRouter.get("/", qualificationController.getQualifications);
qualificationRouter.post("/saveQualMapping", qualificationController.insertQualificationMapping);
qualificationRouter.get("/getQualificationDemographicsMappingReview", qualificationController.getQualificationDemographicsMappingReview);
qualificationRouter.post("/saveQualificationReviewData", qualificationController.insertQualificationReviewData);
qualificationRouter.put("/updateQualificationConstantId", qualificationController.updateQualificationConstantIdController);

export default qualificationRouter;
