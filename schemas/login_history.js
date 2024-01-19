import { Schema, model } from "mongoose";

const login_history = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    user_agent: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
      unique: true,
    },
    device_info: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const login_history_schema = model("login_history", login_history);
export default login_history_schema;
