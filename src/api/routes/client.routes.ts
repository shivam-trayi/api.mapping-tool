import { Router } from "express";
import * as clientController from "../controllers/client.controller";

const clientRouter = Router();

clientRouter.get("/", clientController.getClients);

export default clientRouter;
