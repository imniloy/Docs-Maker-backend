import users_modal from "../schemas/usersModal.js";
import login_history from "../schemas/login_history.js";
import bcrypt from "bcrypt";
import DeviceDetector from "node-device-detector";
import jwt from "jsonwebtoken";

const get_device_info = (user_agent) => {
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });
  const result = detector.detect(user_agent);

  const device_info = {};
  device_info.name = result.os.name;
  device_info.model = result.device.model ? result.device.model : "unknown";
  device_info.type = result.device.type;
  device_info.browser = result.client.name;
  return device_info;
};

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, 10);
    const ip = req.clientIp;

    const getUser = await users_modal.findOne({ email });
    if (getUser) {
      return res.status(404).json({
        message: "user already registered",
      });
    } else {
      const user = await users_modal.create({
        email,
        name,
        password: hashedPassword,
      });
      const uniqueToken = Date.now();
      await login_history.create({
        user_id: user._id,
        user_agent: req.headers["user-agent"],
        ip,
        token: uniqueToken,
        time: uniqueToken,
        device_info: get_device_info(req.headers["user-agent"]),
      });

      const token = jwt.sign(
        {
          name: user.name,
          _id: user.id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: Date.now() + 2 * 24 * 60 * 60 * 1000,
        }
      );

      res.cookie("userToken", uniqueToken, {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      });

      res.status(201).json({
        token,
        message: "User Registration Success",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

async function login(req, res, next) {
  console.log("login");
}

export { login, register };
