import express from 'express';
import { forgotPassword, login, logout, resetPassword, signup } from '../controllers'; // path index.ts ke relative
// import { forgotPasswordValidator, loginValidator, resetPasswordValidator, signupValidator } from '../validators/authValidator/auth.validator';
// import { validateRequest } from '../middlewares/index';

const authRoutes = express.Router();
authRoutes.post('/login', login);
authRoutes.post('/signup', signup);
authRoutes.post('/forgot-password',  forgotPassword);
authRoutes.post('/reset-password',resetPassword);


// authRoutes.post('/login', loginValidator, validateRequest, login);
// authRoutes.post('/signup', signupValidator, validateRequest, signup);
// authRoutes.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
// authRoutes.post('/reset-password', resetPasswordValidator, validateRequest, resetPassword);
authRoutes.post('/logout', logout);
export default authRoutes;
