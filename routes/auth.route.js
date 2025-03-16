import express from 'express';
import { linkedInCallback } from "../controller/auth.controller.js";

const AuthRouter = express.Router();

AuthRouter.get('/callback', linkedInCallback);

export default AuthRouter;
