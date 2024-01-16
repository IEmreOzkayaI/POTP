import express from "express";
import validate_access_token_handler from "../middlewares/validate_access_token_handler.js";
import user_controller from "../controllers/user_controller.js";
import rateLimit from "express-rate-limit";

const user_router = express.Router();

/** Rate Limiter */
const access_limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 5, // limit 5 per IP for windowMs
    message: {
        message: "Too many accounts created from this IP, please try again after three minutes",
        status_code: "429",
        status: "error"
    }
});

user_router.route("/register").post(access_limiter, user_controller.register);
// user_router.route("/log-in").post(user_controller.login);
user_router.route("/log-in").post(access_limiter, user_controller.login);
user_router.route("/main-login").get(access_limiter, user_controller.main_login);
user_router.route("/log-out").get(validate_access_token_handler, user_controller.logout);
user_router.route("/current").get(validate_access_token_handler, user_controller.current);
user_router.route("/confirm").post(user_controller.confirm);
user_router.route("/re-confirm").get(access_limiter, user_controller.re_confirm);


export default user_router;
