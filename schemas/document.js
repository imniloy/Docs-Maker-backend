import { Schema, model } from "mongoose";

const docs_schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const docs_modal = new model("documents", docs_schema);
export default docs_modal;
