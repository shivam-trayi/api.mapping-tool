import express from 'express';
import { forgotPassword, login, logout, resetPassword, signup } from '../controllers'; // path index.ts ke relative
// import { forgotPasswordValidator, loginValidator, resetPasswordValidator, signupValidator } from '../validators/authValidator/auth.validator';
// import { validateRequest } from '../middlewares/index';

const authRouter = express.Router();
authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/forgot-password',  forgotPassword);
authRouter.post('/reset-password',resetPassword);


// authRoutes.post('/login', loginValidator, validateRequest, login);
// authRoutes.post('/signup', signupValidator, validateRequest, signup);
// authRouter.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword);
// authRouter.post('/reset-password', resetPasswordValidator, validateRequest, resetPassword);
authRouter.post('/logout', logout);
export default authRouter;
