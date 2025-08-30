import { Request, Response } from "express";
import * as clientService from "../services/client.service";
import { CLIENT_MESSAGES } from "../constants/messages";

/**
 * GET /clients
 */
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientService.getClients();
    return res.sendSuccess(clients, CLIENT_MESSAGES.CLIENTS_FETCH_SUCCESS);
  } catch (err: any) {
    return res.sendError(err, CLIENT_MESSAGES.CLIENTS_FETCH_FAILED);
  }
};
