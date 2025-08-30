import * as clientDAO from "../dao/client.dao";
import {
  NotFoundError,
  ServiceError,
} from "../../errors/appError";

/**
 * Fetch all clients
 */
export const getClients = async () => {
  try {
    const clients = await clientDAO.getAllClients();

    if (!clients || clients.length === 0) {
      throw new NotFoundError("No clients found");
    }

    return clients;
  } catch (err: any) {
    throw new ServiceError("Failed to fetch clients");
  }
};
