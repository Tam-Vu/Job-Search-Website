import jwt from "jsonwebtoken";
import { toNamespacedPath } from "path";
require("dotenv").config();

const nonSecurePath = [
  "/login",
  "/logout",
  "/register-employer",
  "/user/delete-user",
  "/register-user",
  "/jobs/get-all-legal-job",
  "/employers/:id"
];
const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign({ payload }, key);
  } catch (e) {
    console.log(e);
  }
  return token;
};
const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(token, key);
  } catch (e) {
    console.log(e);
  }
  return decoded;
};

const checkUserJwt = (req, res, next) => {
  console.log(req.method);
  const route = `${req.baseUrl}${req.route.path}`;
  req.route = route;
  let cookies = req.cookies;
  const tokenFromHeader = extractToken(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      //lấy user hiện tại: dùng req.user
      req.user = decoded.payload;
      //lấy token hiện tại: dùng req.token
      req.token = token;
      next();
    } else {
      return res.status(200).json({
        EM: "Not authenticated user",
        EC: 1,
        DT: "",
      });
    }
  } else {
    return res.status(200).json({
      EM: "Not authenticated user",
      EC: 1,
      DT: "",
    });
  }
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserPermission = (req, res, next) => {
  if (req.user) {
    // let role = req.user.role;
    // let currentUrl = req.path;
    // if (!role || role.length === 0) {
    //   return res.status(401).json({
    //     EM: "you have no permission to do this",
    //     EC: 1,
    //     DT: "",
    //   });
    // }
    // const route = `${req.baseUrl}${req.route.path}`;
    console.log("----------------------", req.route);
    next();
  } else {
    return res.status(401).json({
      EM: "Not authenticated user",
      EC: 1,
      DT: "",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJwt,
  checkUserPermission
};
