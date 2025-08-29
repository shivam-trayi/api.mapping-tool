import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../errors/appError';
import logger from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Log known operational errors
    logger.error(
      `[${err.errorCode}] ${err.message} | Status: ${err.statusCode}`
    );

    return res.status(err.statusCode).json(err.toResponse());
  }

  // Unknown/unhandled error
  logger.error(`Unhandled Error: ${err.message} | Stack: ${err.stack}`);

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    errorCode: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
