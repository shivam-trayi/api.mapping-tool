export const ERROR_MESSAGES = {
  GENERAL_ERROR: "An unexpected error occurred",
  VALIDATION_ERROR: "Validation error",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Forbidden access",
  BAD_REQUEST: "Bad request",
  AUTHENTICATION_FAILED: "Authentication failed",
  AUTHORIZATION_FAILED: "Authorization failed",
  ALREADY_EXISTS: "Resource already exists",
  INTERNAL_ERROR: "Internal server error",
  INVALID_JSON: "Invalid JSON payload",
  TOKEN_EXPIRED: "Token has expired",
  INVALID_TOKEN: "Invalid token",
  RESOURCE_CONFLICT: "Resource conflict detected",
} as const;

export const USER_MESSAGES = {
  LOGIN_SUCCESS: "Login successfully",
  LOGIN_FAILED: "Login failed",
  LOGOUT_SUCCESS: "Logout successfully",
  LOGOUT_FAILED: "Logout failed",
  SIGNUP_SUCCESS: "Signup successfully",
  SIGNUP_FAILED: "Signup failed",
} as const;

export const AUTH_MESSAGES = {
  RESET_PASSWORD_SUCCESS: "Password reset successfully",
  RESET_PASSWORD_FAILED: "Password reset failed",
  FORGOT_PASSWORD_SUCCESS: "Password reset token generated",
  FORGOT_PASSWORD_FAILED: "Forgot password failed",
} as const;


export const CLIENT_MESSAGES = {
  CLIENTS_FETCH_SUCCESS: "Clients fetched successfully",
  CLIENTS_FETCH_FAILED: "Failed to fetch clients",
} as const;



export const LANGUAGES_MESSAGES = {
  LANGUAGES_FETCH_SUCCESS: "Languages fetched successfully",
  LANGUAGES_FETCH_FAILED: "Failed to fetch languages",
} as const;


export const QUALIFICATION_MESSAGES = {
  QUALIFICATION_FETCH_SUCCESS: "Qualifications fetched successfully",
  QUALIFICATION_FETCH_FAILED: "Failed to fetch qualifications",
  QUALIFICATIONS_FETCH_SUCCESS: "Qualifications fetched successfully ",
  QUALIFICATIONS_FETCH_FAILED: "Failed to fetch qualifications",


  REVIEW_MAPPING_FETCH_SUCCESS: "Qualifications mapping fetched successfully",
  REVIEW_MAPPING_FETCH_FAILED: "Failed to fetch Qualifications  mapping",
  REVIEW_MAPPING_UPDATE_SUCCESS: "Qualifications mapping updated successfully",
  REVIEW_MAPPING_UPDATE_FAILED: "Failed to update Qualifications mapping",


  QUALIFICATION_INSERT_SUCCESS: "Qualification inserted successfully",
  QUALIFICATION_INSERT_FAILED: "Failed to insert qualification",


} as const;

export const QUESTION_MESSAGES = {
  // Questions messages
  QUESTIONS_FETCH_SUCCESS: "Questions mapping fetched successfully",
  QUESTIONS_FETCH_FAILED: "Failed to fetch questions mapping",

  // Review mapping messages
  REVIEW_MAPPING_FETCH_SUCCESS: "Question review mapping fetched successfully",
  REVIEW_MAPPING_FETCH_FAILED: "Failed to fetch question review mapping",
  REVIEW_MAPPING_UPDATE_SUCCESS: "Question review mapping updated successfully",
  REVIEW_MAPPING_UPDATE_FAILED: "Failed to update question review mapping",

  // Option-specific messages
  OPTIONS_FETCH_SUCCESS: "Options fetched successfully",
  OPTIONS_FETCH_FAILED: "Failed to fetch options",
  OPTIONS_UPDATE_SUCCESS: "Options updated successfully",
  OPTIONS_UPDATE_FAILED: "Failed to update options",

  // Qualification messages
  QUALIFICATION_CREATED_SUCCESS: "Qualification mapping created successfully.",
  QUALIFICATION_CREATED_FAILED: "Failed to create qualification mapping.",
  QUALIFICATION_MAPPING_UPDATE_SUCCESS: "Question mapping updated successfully",
  QUALIFICATION_MAPPING_UPDATE_FAILED: "Failed to update Question mapping",


};


export const OPTION_MESSAGES = {
  OPTION_REVIEW_MAPPING_FETCH_SUCCESS: "Option review mapping fetched successfully",
  OPTION_REVIEW_MAPPING_FETCH_FAILED: "Failed to fetch option review mapping",
  OPTION_REVIEW_MAPPING_UPDATE_SUCCESS: "Option review mapping updated successfully",
  OPTION_REVIEW_MAPPING_UPDATE_FAILED: "Failed to update option review mapping",
};
