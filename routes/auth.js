import express from "express";
const authRouter = express.Router();
import { login, register } from "../controllers/auth.js";
authRouter.post("/register", register);
// authRouter.post("/register", (req, res, next) => {
//   console.log(req);
// });
authRouter.post("/login", login);

export default authRouter;
