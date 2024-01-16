import Individual_User from "../models/user_models/individual_user_model.js";
import Company_User from "../models/user_models/company_user_model.js";
import Admin_User from "../models/user_models/admin_user_model.js";
import Common_User from "../models/user_models/common_user_model.js";
import * as Pure_OTP from "../utils/pure_otp.js";
import Auth from "../models/auth_model.js";
import jwt from "jsonwebtoken";
import send_email from "../utils/send_email.js";
import chalk from "chalk";
import OTP from "../models/otp_model.js";
import getTimestamp from "../utils/time_stamp.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const register = async (_req, _res) => {
    try {
        let DB_access = "";
        let user_id_field = "";
        //----- Profile Check
        if (_req.body.email === "" || _req.body.password === "") {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Email or Password Not Found -- Service : Register`));
            return _res.status(400).send({message: "Email or Password Not Found", status_code: "400", status: "error"});
        }

        if (!(_req.body.role !== "Company_User" || _req.body.role !== "Individual_User" || _req.body.role !== "Admin_User")) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User Role Not Found -- Service : Register`));
            return _res.status(400).send({message: "User Profile Not Found", status_code: "400", status: "error"});
        }

        if (_req.body.status !== undefined) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Status Can Not Send -- Service : Register`));
            return _res.status(400).send({
                message: "User status can not send specifically",
                status_code: "400",
                status: "error"
            });
        }

        try {
            const is_user_available = await Common_User.findOne({email: _req.body.email});
            if (is_user_available) throw new Error("User Already Exists");
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Register`));
            return _res.status(400).json({message: "User Already Exists", status_code: "400", status: "error"});
        }

        //----- DB Access Type Check
        if (_req.body.role === "Company_User") DB_access = Company_User;
        if (_req.body.role === "Individual_User") DB_access = Individual_User;
        if (_req.body.role === "Admin_User") DB_access = Admin_User;

        //----- User Check
        if (_req.body.role === "Company_User") user_id_field = "company_user_id";
        if (_req.body.role === "Individual_User") user_id_field = "individual_user_id";
        if (_req.body.role === "Admin_User") user_id_field = "admin_user_id";

        //----- User Register
        const user_register_info = {..._req.body};
        delete user_register_info.role;


        user_register_info.password = await bcrypt.hash(Buffer.from(_req.body.password, "utf-8"), 10);
        //----- User Register to DB & Response
        try {
            const user_registered = await DB_access.create(user_register_info);
            if (!user_registered) {
                throw new Error("User Register Error");
            }
            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User Saved -- ID : ${user_registered._id}  -- User DB`));
            const userId = user_registered._id.toString();
            //------------------
            const query = {};
            query[user_id_field] = user_registered._id;
            const secret_key = Pure_OTP.generateSecretKey();
            const is_secret_key_added = await Auth.create({
                ...query,
                otp_secret_key: secret_key,
                created_at: Date.now()
            });

            if (!is_secret_key_added) throw new Error("OTP Secret adding Error");
            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User OTP Secret Key Saved -- ID : ${user_registered._id} -- Auth DB`));
            await Common_User.create({
                email: _req.body.email,
                role: _req.body.role,
                user_id: userId,
                totp_secret_key: secret_key
            });
            const confirm_credential = Pure_OTP.generateOTP(secret_key);
            const verification_code = await OTP.create({
                ...query,
                verification_code: confirm_credential,
                created_at: Date.now()
            });
            if (!verification_code) throw new Error("OTP Code Error");
            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User TOTP Saved -- ID : ${user_registered._id} -- OTP DB`));
            //------------------
            const confirm_token = jwt.sign({
                user_id: user_registered._id,
                role: _req.body.role
            }, process.env.CONFIRM_TOKEN_SECRET, {expiresIn: "1h"});

            send_email(_req.body.email, "Confirm account 🤕", "confirm_account", confirm_credential);

            _res.cookie("confirm_token", confirm_token, {
                maxAge: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE) * 60 * 1000,
                // domain: "localhost",
                sameSite: "None",
                secure: true,
                httpOnly: true,
            }); //------------------

            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 201 -- Info : User Created -- ID : ${user_registered._id}`));
            return _res.status(201).json({
                message: "User Created , Please Confirm Your Email",
                status_code: "201",
                confirm_time: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE),
                status: "success"
            });
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Register`));
            return _res.status(400).json({message: "Invalid User Data", status_code: "400", status: "error"});
        }
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Register`));
        return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
    }
};

// @desc   Confirm a new user
// @route   POST /api/user/confirm
// @access  Public q
const confirm = async (_req, _res) => {
        try {
            let DB_access = "";
            let user_id_field = "";
            let confirm_user = "";
            const token = _req.cookies.confirm_token;
            const authZ_token = _req.cookies.authZ_token;
            const requestReceivedTime = Date.now();

            // Verify the token
            if (token) {
                jwt.verify(token, process.env.CONFIRM_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                        return _res.status(403).json({
                            message: "Not authorized, no valid token",
                            status_code: "403",
                            status: "error"
                        });
                    }
                    // If the token is valid, set the user in the request and proceed to the next middleware
                    confirm_user = {user_id: decoded.user_id, role: decoded.role};
                });
            }

            if (authZ_token) {
                jwt.verify(authZ_token, process.env.AUTHZ_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                        return _res.status(403).json({
                            message: "Not authorized, no valid token",
                            status_code: "403",
                            status: "error"
                        });
                    }
                    // If the token is valid, set the user in the request and proceed to the next middleware
                    confirm_user = {user_id: decoded.user_id, role: decoded.role, email: decoded.email}
                })
            }

            if (!(confirm_user.role !== "Company_User" || confirm_user.role !== "Individual_User" || confirm_user.role !== "Admin_User")) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User Role Not Found -- Service : Confirm`));
                return _res.status(400).send({
                    message: "User Profile Not Found",
                    status_code: "400",
                    status: "error"
                });
            }
            //----- DB Access Type Check
            if (confirm_user.role === "Company_User") user_id_field = "company_user_id";
            if (confirm_user.role === "Individual_User") user_id_field = "individual_user_id";
            if (confirm_user.role === "Admin_User") user_id_field = "admin_user_id";

            //----- DB Access Type Check
            if (confirm_user.role === "Company_User") DB_access = Company_User;
            if (confirm_user.role === "Individual_User") DB_access = Individual_User;
            if (confirm_user.role === "Admin_User") DB_access = Admin_User;

            try {
                const query = {};
                query[user_id_field] = confirm_user.user_id;
                const validate_user = await OTP.findOne({
                    ...query,
                });
                if (!validate_user) throw new Error("OTP Code DB Search Error");
                if (requestReceivedTime - validate_user.created_at > 60000) throw new Error("OTP Code Expired");
                if (validate_user.verification_code !== _req.body.confirm_credential) throw new Error("OTP Code Not Match");

                await OTP.deleteOne({...query});
                if (token) {
                    await DB_access.updateOne({_id: confirm_user.user_id}, {status: "ACTIVE"})

                    _res.clearCookie("confirm_token");

                    console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Verified -- ID : ${confirm_user.user_id}`));
                    return _res.status(200).json({message: "User Verified", status_code: "200", status: "success"});
                }
                if (authZ_token) {
                    await main_login(_req, _res);
                    // return _res.redirect("/api/user/main-login");
                }

            } catch (error) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error  : ${error} -- Service : Confirm`));
                return _res.status(400).json({message: "User OTP Error", status_code: "400", status: "error"});
            }
        } catch
            (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Confirm`));
            return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
        }
    }
;

// @desc   Re-Validate a new user
// @route   GET /api/user/re-confirm
// @access  Public
const re_confirm = async (_req, _res) => {
    try {
        let user_id_field = "";
        let confirm_user = "";
        let DB_access = "";
        const token = _req.cookies.confirm_token;
        const authZ_token = _req.cookies.authZ_token;

        // Verify the token
        if (token) {
            jwt.verify(token, process.env.CONFIRM_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                    return _res.status(403).json({
                        message: "Not authorized, no valid token",
                        status_code: "403",
                        status: "error"
                    });
                }
                // If the token is valid, set the user in the request and proceed to the next middleware
                confirm_user = {user_id: decoded.user_id, role: decoded.role};
            });
        }

        if (authZ_token) {
            jwt.verify(authZ_token, process.env.AUTHZ_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                    return _res.status(403).json({
                        message: "Not authorized, no valid token",
                        status_code: "403",
                        status: "error"
                    });
                }
                // If the token is valid, set the user in the request and proceed to the next middleware
                confirm_user = {user_id: decoded.user_id, role: decoded.role, email: decoded.email}
            })
        }

        if (!(confirm_user.role !== "Company_User" || confirm_user.role !== "Individual_User" || confirm_user.role !== "Admin_User")) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User Role Not Found -- Service : Re-Validate`));
            return _res.status(400).send({
                message: "User Profile Not Found",
                status_code: "400",
                status: "error"
            });
        }
        //----- DB Access Type Check
        if (confirm_user.role === "Company_User") user_id_field = "company_user_id";
        if (confirm_user.role === "Individual_User") user_id_field = "individual_user_id";
        if (confirm_user.role === "Admin_User") user_id_field = "admin_user_id";


        //----- User Check
        const re_confirmed_user = await Common_User.findOne({user_id: confirm_user.user_id});
        try {
            const query = {};
            query[user_id_field] = confirm_user.user_id;
            const validate_user = await OTP.findOne({...query});
            if (validate_user) await OTP.deleteOne({...query});
            const auth_model = await Auth.findOne({...query});
            if (!auth_model) throw new Error("OTP Secret Key Not Found");
            const confirm_credential = Pure_OTP.generateOTP(auth_model.otp_secret_key);
            const verification_code = await OTP.create({
                ...query,
                verification_code: confirm_credential,
                created_at: Date.now()
            });
            if (!verification_code) throw new Error("OTP Code Creation Error");
            //------------------
            if (token) {
                let confirm_token = jwt.sign({
                    user_id: confirm_user.user_id,
                    role: confirm_user.role
                }, process.env.CONFIRM_TOKEN_SECRET, {expiresIn: "1h"}); //TODO: Can change , WE CAN NOT GIVE A NEW TOKEN BECAUSE ALREADY HAS TIME

                _res.cookie("confirm_token", confirm_token, {
                    maxAge: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE) * 60 * 1000,
                    sameSite: "None",
                    // domain: "localhost",
                    secure: true,
                    httpOnly: true,
                });
                //------------------
                send_email(re_confirmed_user.email, "Confirm account 🤕", "confirm_account", confirm_credential);
                //TODO: CAN CHANGE BECAUSE OF URL WE CAN GİVE AN REFRESH TOKEN ALSO FOR CONFIRM STEP AND THEN DELETE THEM. BUT NOW WE USE THIS
                console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Re Confirmed -- ID : ${confirm_user.user_id}`));
                return _res.status(200).json({
                    message: "Validate Token , resend please confirm",
                    status_code: "200",
                    confirm_time: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE),
                    status: "success"
                });
            }
            if (authZ_token) {
                const authZ_token = jwt.sign({
                    user_id: confirm_user.user_id,
                    role: confirm_user.role,
                    email: re_confirmed_user.email,
                }, process.env.AUTHZ_TOKEN_SECRET, {expiresIn: "1h"});

                await send_email(re_confirmed_user.email, "Authorize account 🤕", "confirm_account", confirm_credential);

                _res.cookie("authZ_token", authZ_token, {
                    maxAge: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE) * 60 * 1000,
                    sameSite: "None",
                    // domain: "localhost",
                    secure: true,
                    httpOnly: true,
                }); //------------------

                console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Re Confirmed -- ID : ${confirm_user.user_id}`));
                return _res.status(200).json({
                    message: "Validate Token , resend please confirm",
                    status_code: "200",
                    confirm_time: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE),
                    status: "success"
                });

            }
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : ${error} -- Service : Re-Validate`));
            return _res.status(400).json({message: "User OTP Error", status_code: "400", status: "error"});
        }
    } catch (error) {
    }
};

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
const login = async (_req, _res) => {
        try {
            let DB_access = "";
            let is_user_available = "";
            let is_password_match = "";
            let user_id_field = "";
            //----- Input Check
            if (_req.body.email === "" || _req.body.password === "") {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Email or Password Not Found -- Service : Login`));
                return _res.status(400).send({
                    message: "Email or Password Not Found",
                    status_code: "400",
                    status: "error"
                });
            }
            //----- User Exist Check
            try {
                is_user_available = await Common_User.findOne({email: _req.body.email});
                if (!is_user_available) throw new Error("User Not Found");
            } catch (error) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} : Email -- Service : Login`));
                return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
            }

            //----- DB Access Type Check
            if (is_user_available.role === "Company_User") DB_access = Company_User;
            if (is_user_available.role === "Individual_User") DB_access = Individual_User;
            if (is_user_available.role === "Admin_User") DB_access = Admin_User;

            //----- User Refresh Token Check Field Detection
            if (is_user_available.role === "Company_User") user_id_field = "company_user_id";
            if (is_user_available.role === "Individual_User") user_id_field = "individual_user_id";
            if (is_user_available.role === "Admin_User") user_id_field = "admin_user_id";

            //----- User Check
            try {
                const check_user_availability = await DB_access.findOne({email: _req.body.email});
                if (!check_user_availability) throw new Error("User Not Found In Related DB");
                is_user_available = {is_user_available, check_user_availability};
            } catch (error) {
                console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login`));
                return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
            }

            // ---- Password Check
            try {
                is_password_match = await bcrypt.compare(Buffer.from(_req.body.password, "utf-8"), is_user_available.check_user_availability.password);
                if (!is_password_match) throw new Error("Password Not Match");
            } catch (error) {

                console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login`));
                return _res.status(401).json({
                    message: "Invalid Credentials : Password",
                    status_code: "400",
                    status: "error"
                });
            }

            const query = {};
            query[user_id_field] = is_user_available.check_user_availability._id;

            const validate_user = await OTP.findOne({...query});
            if (validate_user) await OTP.deleteOne({...query});
            const auth_model = await Auth.findOne({...query});
            if (!auth_model) throw new Error("OTP Secret Key Not Found");
            const confirm_credential = Pure_OTP.generateOTP(auth_model.otp_secret_key);

            const verification_code = await OTP.create({
                ...query,
                verification_code: confirm_credential,
                created_at: Date.now()
            });
            if (!verification_code) throw new Error("OTP Code Error");
            //------------------
            if (is_user_available.check_user_availability.status === "PASSIVE") {

                const confirm_token = jwt.sign({
                    user_id: is_user_available.check_user_availability._id,
                    role: is_user_available.is_user_available.role
                }, process.env.CONFIRM_TOKEN_SECRET, {expiresIn: "1h"});
                await send_email(_req.body.email, "Confirm account 🤕", "confirm_account", confirm_credential);

                _res.cookie("confirm_token", confirm_token, {
                    maxAge: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE) * 60 * 1000,
                    sameSite: "None",
                    // domain: "localhost",
                    secure: true,
                    httpOnly: true,
                }); //------------------

                console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : User is not active -- Service : Login -- ID : ${is_user_available.is_user_available.email}`));
                return _res.status(401).json({message: "User is not active", status_code: "401", status: "error"});
            }
            if (is_user_available.check_user_availability.status === "ACTIVE") {
                const authZ_token = jwt.sign({
                    user_id: is_user_available.check_user_availability._id,
                    role: is_user_available.is_user_available.role,
                    email: _req.body.email,
                }, process.env.AUTHZ_TOKEN_SECRET, {expiresIn: "1h"});

                await send_email(_req.body.email, "Authorize account 🤕", "confirm_account", confirm_credential);

                _res.cookie("authZ_token", authZ_token, {
                    maxAge: parseInt(process.env.CONFIRM_SCREEN_TIMER_MINUTE) * 60 * 1000,
                    sameSite: "None",
                    // domain: "localhost",
                    secure: true,
                    httpOnly: true,
                }); //------------------

                console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Authorization Error -- Service : Login -- ID : ${is_user_available.is_user_available.email}`));
                return _res.status(401).json({message: "Authorization Error", status_code: "401", status: "error"});
            }
        } catch
            (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Login`));
            return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
        }
    }
;

const main_login = async (_req, _res) => {
    try {
        let DB_access = "";
        let is_user_available = "";
        let is_password_match = "";
        let user_id_field = "";
        const authZ_token = _req.cookies.authZ_token;

        // Verify the token
        if (authZ_token) {
            jwt.verify(authZ_token, process.env.AUTHZ_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                    return _res.status(403).json({
                        message: "Not authorized, no valid token",
                        status_code: "403",
                        status: "error"
                    });
                }
                // If the token is valid, set the user in the request and proceed to the next middleware
                is_user_available = {user_id: decoded.user_id, role: decoded.role, email: decoded.email}
            })
        }

        //----- Input Check
        if (is_user_available.email === "") {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Email or Password Not Found -- Service : Login`));
            return _res.status(400).send({
                message: "Email or Password Not Found",
                status_code: "400",
                status: "error"
            });
        }
        //----- User Exist Check
        try {
            is_user_available = await Common_User.findOne({email: is_user_available.email});
            if (!is_user_available) throw new Error("User Not Found");
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} : Email -- Service : Login`));
            return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
        }

        //----- DB Access Type Check
        if (is_user_available.role === "Company_User") DB_access = Company_User;
        if (is_user_available.role === "Individual_User") DB_access = Individual_User;
        if (is_user_available.role === "Admin_User") DB_access = Admin_User;

        //----- User Refresh Token Check Field Detection
        if (is_user_available.role === "Company_User") user_id_field = "company_user_id";
        if (is_user_available.role === "Individual_User") user_id_field = "individual_user_id";
        if (is_user_available.role === "Admin_User") user_id_field = "admin_user_id";

        //----- User Check
        try {
            const check_user_availability = await DB_access.findOne({email: is_user_available.email});
            if (!check_user_availability) throw new Error("User Not Found In Related DB");
            is_user_available = {is_user_available, check_user_availability};
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login`));
            return _res.status(401).json({message: "Invalid Credentials", status_code: "401", status: "error"});
        }
        //----- DB Access Type Check
        try {
            const query = {};
            query[user_id_field] = is_user_available.check_user_availability._id;
            const auth_model = await Auth.findOne({...query});
            if (auth_model.refresh_token) throw new Error("User Already Logged In");
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Login`));
            return _res.status(401).json({
                message: "User Already Logged In",
                status_code: "401",
                status: "error"
            });
        }

        //----- JWT Token Create
        const access_token = jwt.sign({
            _id: is_user_available.check_user_availability._id,
            role: is_user_available.is_user_available.role
        }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"});

        const refresh_token = jwt.sign({
            _id: is_user_available.check_user_availability._id,
            role: is_user_available.is_user_available.role
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d"});

        //----- Token Save to DB & Cookie Set & Response
        try {
            const query = {};
            query[user_id_field] = is_user_available.check_user_availability._id;
            const current_user = {...query, refresh_token};

            const auth_result = await Auth.updateOne(current_user);
            if (!auth_result) throw new Error("Auth DB Error");
            _res.cookie("refresh_token", refresh_token, {
                maxAge: 60 * 60 * 1000 * 24,
                sameSite: "None",
                // domain: "localhost",
                secure: true, // "true" yerine "true" olarak ayarlanmalı
                httpOnly: true, // "true" yerine "true" olarak ayarlanmalı
            });

            _res.cookie("access_token", access_token, {
                maxAge: 60 * 1000, // 1 minute
                sameSite: "None",
                // domain: "localhost",
                secure: true, // "true" yerine "true" olarak ayarlanmalı
                httpOnly: true, // "true" yerine "true" olarak ayarlanmalı
            });

            _res.clearCookie("authZ_token");
            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Authenticated -- ID : ${is_user_available.check_user_availability._id}`));
            return _res.status(200).json({
                message: "User Authenticated",
                status_code: "200",
                status: "success"
            });
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 404 -- Error : ${error} -- Service : Login`));
            return _res.status(404).json({message: "Invalid Auth Data", status_code: "404", status: "error"});
        }
    } catch
        (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Login`));
        return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
    }
}

// @desc    Logout user
// @route   GET /api/user/logout
// @access  Private
const logout = async (_req, _res) => {
    try {
        const cookies = _req.cookies;
        if (!cookies?.refresh_token) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 204 -- Error : Cookie is not available ! -- Service : Logout`));
            return _res.status(204).json({
                message: "Cookie is not available !",
                status_code: "204",
                status: "error"
            }); //No content
        }
        const refresh_token = cookies.refresh_token;
        let found_user = await Auth.findOne({refresh_token});

        if (!found_user) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 204 -- Error : User is not available ! -- Service : Logout`));
            return _res.status(204).json({
                message: "User is not available !",
                status_code: "204",
                status: "error"
            });
        }
        await Auth.updateOne({_id: found_user._id}, {$unset: {refresh_token: ""}});
        _res.clearCookie("refresh_token", {httpOnly: true});
        _res.clearCookie("access_token", {httpOnly: true});
        console.info(chalk.green.bold(`${getTimestamp()} Status Code : 204 -- Info : User Logged Out -- ID : ${found_user._id}`));
        return _res.status(204).json({message: "User is logged out !", status_code: "204", status: "success"});
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Logout`));
        return _res.status(503).json({message: "Server Error", status_code: "503", status: "error"});
    }
};


// @desc    Get current user information by token id
// @route   GET /api/user/current
// @access  Private
const current = async (_req, _res) => {
    try {
        let DB_access = "";
        //-----
        if (!(_req.body.role !== "Company_User" || _req.body.role !== "Individual_User" || _req.body.role !== "Admin_User")) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : User Role Not Found -- Service : Current User`));
            return _res.status(400).send({
                message: "User Profile Not Found",
                status_code: "400",
                status: "error"
            });
        }
        //-----
        if (_req.user.role === "Company_User") DB_access = Company_User;
        if (_req.user.role === "Individual_User") DB_access = Individual_User;
        if (_req.user.role === "Admin_User") DB_access = Admin_User;
        //-----
        try {
            const is_user_available = await DB_access.findOne({_id: _req.user._id});
            if (!is_user_available) throw new Error("User Not Found");
            const user_dto = {
                _id: is_user_available._id,
                name: is_user_available.name,
                surname: is_user_available.surname,
                email: is_user_available.email,
            };
            console.info(chalk.green.bold(`${getTimestamp()} Status Code : 200 -- Info : User Info Sent -- ID : ${is_user_available._id}`));
            return _res.status(200).json(user_dto);
        } catch (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : ${error} -- Service : Current User`));
            return _res.status(401).json({message: "Invalid Credentials"});
        }
        //-----
    } catch (error) {
        console.error(chalk.bold(`${getTimestamp()} Status Code : 503 -- Error : ${error} -- Service : Current User`));
        return _res.status(503).json({message: "Server Error"});
    }
};

const user_controller = {
    register,
    login,
    logout,
    current,
    confirm,
    re_confirm,
    main_login,
};
export default user_controller;

// Public (Herkese Açık): Herhangi bir kullanıcının, oturum açmış veya açmamış olsalar bile, bu rotaya erişim sağlamasına izin verilir. Genellikle kayıt olma veya giriş yapma gibi işlemler için kullanılır.

// Private (Özel): Yalnızca oturum açmış kullanıcıların bu rotaya erişimine izin verilir. Bu tür rotalar, kullanıcıların oturum açmış olmalarını gerektiren özel verilere veya işlemlere erişim sağlar.

// Protected (Korumalı): Bu rotalar, belirli bir rol veya izne sahip kullanıcılara erişim sağlar. Örneğin, sadece yönetici rollerine sahip kullanıcıların erişebileceği belirli bir yönetim paneli rotası olabilir.

// _restricted (Sınırlı): Bu rotalar, belirli bir izne sahip kullanıcıların erişimine izin verir, ancak oturum açmış olma şartı yoktur. Örneğin, bir moderasyon işlevselliği için kullanılabilir.

// TODO: Mail sender service will be added later ,  for now there is no google account for company