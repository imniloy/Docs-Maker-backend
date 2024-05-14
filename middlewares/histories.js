import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import login_history_schema from "../schemas/login_history.js";
import users_modal from "../schemas/usersModal.js";

const auth_check = async (req, res, next) => {
  const { cookie_token } = req;

  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split("Bearer ")[1];

    if (token) {
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check the user exists in the database...
        const getUser = await users_modal.findOne({
          _id: new mongoose.mongo.ObjectId(user._id),
        });

        // if the user exists in the database... else send response 401...
        if (getUser._id) {
          const device = await login_history_schema.findOne({
            $and: [
              {
                user_id: new mongoose.mongo.ObjectId(user._id),
              },
              {
                user_agent: req.headers["user-agent"],
              },
              {
                token: cookie_token,
              },
            ],
          });

          if (device) {
            req.userInfo = {
              _id: getUser._id,
              name: getUser.name,
              email: getUser.email,
            };
            next();
          } else {
            return res.status(401).json({
              message: "Unauthorized",
            });
          }
        } else {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
      } catch (e) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } else {
    console.log("authorization");
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

const cookie_check = async (req, res, next) => {
  const { userToken } = req.cookies;

  if (userToken) {
    req.cookie_token = userToken;
    next();
  } else {
    req.cookie_token = "";
    next();
  }
};

export { cookie_check, auth_check };
