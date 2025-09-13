import express from 'express';
import { forgotPassword, login, logout, resetPassword, signup } from '../controllers'; 

const authRouter = express.Router();
authRouter.post('/login', login);
authRouter.post('/signup', signup);
authRouter.post('/forgot-password',  forgotPassword);
authRouter.post('/reset-password',resetPassword);
authRouter.post('/logout', logout);
export default authRouter;
