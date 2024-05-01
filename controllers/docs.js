import mongoose from "mongoose";
import docs_modal from "../schemas/document.js";

const get_user_all_docs_controller = async (req, res, next) => {
  console.log("get_user_all_docs_controller");
  try {
    const user = req.user;

    const all_docs = await docs_modal
      .find({ userId: user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "all_docs", all_docs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { get_user_all_docs_controller };
