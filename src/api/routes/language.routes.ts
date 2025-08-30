import { Router } from "express";
import * as languageController from "../controllers/language.controller";

const languageRouter = Router();

languageRouter.get("/", languageController.getLanguages);

export default languageRouter;
