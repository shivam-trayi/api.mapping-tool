import { Router } from "express";
import * as qualificationController from "../controllers/qualification.controller";

const qualificationRouter = Router();

qualificationRouter.get("/", qualificationController.getQualifications);

export default qualificationRouter;
