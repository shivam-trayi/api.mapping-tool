import { Router } from "express";
import authRouter from "./auth.routes";
import languageRouter from "./language.routes";
import clientRouter from "./client.routes";

const allRouter = Router();

allRouter.use("/auth", authRouter);
allRouter.use("/languages", languageRouter);
allRouter.use("/clients", clientRouter);

export default allRouter;
