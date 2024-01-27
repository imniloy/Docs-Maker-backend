import express from "express";
import historiescontroller from "../controllers/histories.js";
import { cookie_check, auth_check } from "../middlewares/histories.js";
const historyRouter = express.Router();

historyRouter.get("/history", cookie_check, auth_check, historiescontroller);

export default historyRouter;
