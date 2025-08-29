import { Response, Request, NextFunction } from 'express';
import {
  buildSuccess,
  buildError,
  buildValidationError,
} from '../../helper/response';

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendSuccess = (data: any, message = 'Success', status = 200) => {
    return res.status(status).json(buildSuccess(data, message));
  };

  res.sendError = (error: any, message = 'Error', status = 400) => {
    return res.status(status).json(buildError(error, message));
  };

  res.sendValidationError = (
    errors: any[],
    message = 'Validation Error',
    status = 400
  ) => {
    return res.status(status).json(buildValidationError(errors, message));
  };

  next();
};
