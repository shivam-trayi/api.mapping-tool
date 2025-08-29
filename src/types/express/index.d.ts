import 'express';

declare module 'express-serve-static-core' {
  interface Response {
    sendSuccess: (data: any, message?: string, status?: number) => Response;
    sendError: (error: any, message?: string, status?: number) => Response;
    sendValidationError: (
      errors: any[],
      message?: string,
      status?: number
    ) => Response;
  }
}
