import express from "express";
import {
  delete_document,
  findByIdOrCreate,
  get_user_all_docs_controller,
  update_doc_name,
} from "../controllers/docs.js";
import { docs_auth_check } from "../middlewares/documents.js";
const docsRouter = express.Router();

docsRouter.get("/all", docs_auth_check, get_user_all_docs_controller);
docsRouter.post("/update-doc-name/:id", docs_auth_check, update_doc_name);
docsRouter.delete("/doc-delete/:id", docs_auth_check, delete_document);

export default docsRouter;
