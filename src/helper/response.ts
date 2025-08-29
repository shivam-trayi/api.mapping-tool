// import logger from '../api/utils/logger';

// export const buildSuccess = (data: any, message = 'Success') => {
//   logger.info(`Response Success: ${message}`);
//   return {
//     status: 200,
//     data,
//     message,
//     errors: false,
//     success: true,
//     timestamp: new Date().toISOString(),
//   };
// };

// export const buildError = (error: any, message = 'Error') => {
//   logger.error(`Response Error: ${message} | ${error?.message || error}`);
//   return {
//     status: error?.statusCode || 400,
//     data: null,
//     message: error?.message || message,
//     errors: true,
//     success: false,
//     errorCode: error?.errorCode || 'UNKNOWN_ERROR',
//     timestamp: new Date().toISOString(),
//   };
// };

// export const buildValidationError = (
//   errors: any[],
//   message = 'Validation Error'
// ) => {
//   logger.warn(`Validation Error: ${JSON.stringify(errors)}`);
//   return {
//     status: 422,
//     data: null,
//     message,
//     errors,
//     success: false,
//     timestamp: new Date().toISOString(),
//   };
// };

import logger from '../api/utils/logger';

export const buildSuccess = (data: any, message = 'Success', status = 200) => {
  logger.info(`Response Success: ${message}`);
  return {
    status,
    data,
    message,
    errors: false,
    success: true,
    timestamp: new Date().toISOString(),
  };
};

export const buildError = (error: any, message = 'Error') => {
  const statusCode = error?.statusCode || 400;
  const errorMessage = error?.message || message;
  const errorCode = error?.errorCode || 'UNKNOWN_ERROR';

  logger.error(`Response Error: ${errorMessage} | ${errorCode}`);

  return {
    status: statusCode,
    data: null,
    message: errorMessage,
    errors: true,
    success: false,
    errorCode,
    timestamp: new Date().toISOString(),
  };
};

export const buildValidationError = (
  errors: any[],
  message = 'Validation Error',
  status = 422
) => {
  logger.warn(`Validation Error: ${JSON.stringify(errors)}`);
  return {
    status,
    data: null,
    message,
    errors,
    success: false,
    timestamp: new Date().toISOString(),
  };
};
