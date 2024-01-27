import mongoose from "mongoose";
import login_history_schema from "../schemas/login_history.js";

const historiescontroller = async (req, res, next) => {
  const { _id } = req.userInfo;
  try {
    const get_login_history = await login_history_schema
      .find({
        user_id: new mongoose.mongo.ObjectId(_id),
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: get_login_history,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default historiescontroller;
