import express from "express";
import access_token_controller from "../controllers/access_token_controller.js";
const token_router = express.Router();

token_router.route("/token").get(access_token_controller.access_token);


export default token_router;

