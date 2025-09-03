import { Router } from "express";
import authRouter from "./auth.routes";
import languageRouter from "./language.routes";
import clientRouter from "./client.routes";
import qualificationRouter from "./qualification.routes";
import questionRouter from "./question.routes";

const allRouter = Router();

allRouter.use("/auth", authRouter);
allRouter.use("/languages", languageRouter);
allRouter.use("/clients", clientRouter);
allRouter.use("/qualifications", qualificationRouter);
allRouter.use("/questions", questionRouter);



export default allRouter;
