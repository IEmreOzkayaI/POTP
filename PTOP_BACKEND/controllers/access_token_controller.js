import Auth from "../models/auth_model.js";
import async_handler from "express-async-handler";
import jwt from "jsonwebtoken";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import dotenv from "dotenv";

dotenv.config();

// @route   GET /api/access/token
// @access  Public
const access_token = async (_req, _res) => {
    try {
        const cookies = _req.cookies;
        if (!cookies?.refresh_token) return _res.status(400).json({message: "Refresh Token Cookie is not available !"}); // No content
        const refresh_token = cookies.refresh_token;
        try {
            const found_user = await Auth.findOne({refresh_token});
            if (!found_user) {
                _res.clearCookie("jwt", {httpOnly: true});
                throw new Error();
            }
            try {
                jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if (err || found_user.email !== decoded.email) throw new Error();
                    const access_token = jwt.sign({
                        _id: decoded._id,
                        role: decoded.role
                    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1m"});
                    _res.cookie("access_token", access_token, {
                        maxAge: 60 * 1000,
                        sameSite: "None",
                        // domain: "localhost",
                        secure: true, // "true" yerine "true" olarak ayarlanmalı
                        httpOnly: true, // "true" yerine "true" olarak ayarlanmalı
                    });
                    _res.redirect(_req.query.originalUrl);
                });
            } catch (error) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : Not authorized, no valid token -- Service : refresh_token`));
                return _res.status(403).json({message: "Not authorized, no valid token"});
            }
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 204 -- Error : User is not available ! -- Service : refresh_token`));
            return _res.status(204).json("User is not available !");
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : Server Error -- Service : refresh_token`));
        return _res.status(503).json({message: "Server Error"});
    }
};

export default {access_token};
