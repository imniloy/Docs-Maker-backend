import express from "express";
import { get_user_all_docs_controller } from "../controllers/docs.js";
import { docs_auth_check } from "../middlewares/documents.js";
const docsRouter = express.Router();

docsRouter.get("/all-docs", docs_auth_check, get_user_all_docs_controller);
docsRouter.get("/all-docs/:id", docs_auth_check, get_user_all_docs_controller);

export default docsRouter;
