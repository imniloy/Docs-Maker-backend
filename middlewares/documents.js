import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import users_modal from "../schemas/usersModal.js";

const docs_auth_check = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader && authHeader.split(" ")[1];
    // console.log(bearerToken);
    if (!bearerToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userToken = await jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    // console.log(userToken);
    if (userToken) {
      try {
        // Check the user exists in the database...
        const getUser = await users_modal.findOne({
          _id: userToken._id,
        });

        if (getUser._id) {
          // Attach the user information to the request object
          req.user = getUser;

          // Call next middleware
          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: error.message || "Internal Server Error" });
      }
    } else {
      console.log("Error");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { docs_auth_check };
