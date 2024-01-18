import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import body_parser from "body-parser";
import cookie_parser from "cookie-parser";
import requestIp from "request-ip";
import authRouter from "./routes/auth.js";
const port = process.env.PORT || 5000;

dotenv.config();
const mode = "dev";

app.use(
  cors({
    origin: mode === "dev" ? "*" : "http://localhost:5173",
    credentials: true,
  })
);
app.use(body_parser.json());
app.use(cookie_parser);
app.use(requestIp.mw());

const db_connect = async () => {
  try {
    if (mode === "dev") {
      await mongoose.connect(process.env.LOCAL_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("LOcal db connected successfullys");
    } else if (mode === "pro") {
      await mongoose.connect(process.env.PRODUCTION_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log("PRODUCTION db connected successfullys");
    }
  } catch (e) {
    console.warn("Database connection Error", e);
  }
};
db_connect();

app.use("api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.listen(port, () =>
  console.log("Server is up and running on port : " + port)
);
