import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
/** Router */
import user_router from "./routes/user_router.js";
import token_router from "./routes/token_router.js";
import credentials from "./middlewares/credentials.js";
import cors_options from "./config/cors_options.js";
import {connectDb} from "./config/db_connection.js";
import dotenv from "dotenv";
/** DB Connection */
connectDb()

const app = express();
dotenv.config();

/** Request Handler Middlewares */
app.use(credentials);
app.use(cors(cors_options));
app.use(express.urlencoded({extended: false}));
app.use(express.text({ type: "text/plain" }));
app.use(express.json());
app.use(cookieParser());
app.disable("x-powered-by");

app.get("/api/user/forgot-password", (_req, _res) => {
	_res.render("forgot-password");
})

/** Router Connection */
app.use("/api/user", user_router);
app.use("/api/access", token_router);

app.use("*", (_req, _res) => {
	_res.status(404).json({error: "Page not found mu 🤕?"});
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
