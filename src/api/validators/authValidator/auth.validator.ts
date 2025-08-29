// C:\Users\TS-05\Desktop\api.mapping-tool\src\api\validators\authValidator\auth.validator.ts

import { body } from 'express-validator';

// ------------------ LOGIN VALIDATOR ------------------
export const loginValidator = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string'),
];

// ------------------ SIGNUP VALIDATOR ------------------
export const signupValidator = [
  body('name')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  // body('confirmPassword')
  //   .notEmpty().withMessage('Confirm Password is required')
  //   .custom((value, { req }) => value === req.body.password)
  //   .withMessage('Passwords do not match'),
];

// ------------------ FORGOT PASSWORD VALIDATOR ------------------
export const forgotPasswordValidator = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];

// ------------------ RESET PASSWORD VALIDATOR ------------------
export const resetPasswordValidator = [
  body('token')
    .notEmpty().withMessage('Token is required')
    .isString().withMessage('Token must be a string'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
];
