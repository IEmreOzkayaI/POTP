import jwt from "jsonwebtoken";
import chalk from "chalk";
import getTimestamp from "../utils/time_stamp.js";
import dotenv from "dotenv";

dotenv.config()

const validate_access_token = async (_req, _res, next) => {
        try {
            const access_token = _req.cookies.access_token
            const refresh_token = _req.cookies.refresh_token
            if (!access_token) {
                if (!refresh_token) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 401 -- Error : Not authorized, no token -- Service : validate_access_token`));
                    return _res.status(401).json({
                        message: "Not authorized, no token",
                        status_code: "401",
                        status: "error"
                    });
                }
                return _res.redirect("/api/access/token?originalUrl=" + _req.originalUrl);

            }

            jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error(chalk.bold(`${getTimestamp()} Status Code : 403 -- Error : ${err} -- Service : confirm_token`));
                    return _res.status(403).json({
                        message: "Not authorized, no valid token",
                        status_code: "403",
                        status: "error"
                    });
                }
                // If the token is valid, set the user in the request and proceed to the next middleware
                _req.user = {_id: decoded._id, role: decoded.role};
                next();
            });


        } catch
            (error) {
            console.error(chalk.bold(`${getTimestamp()} Status Code : 400 -- Error : Validate Token Error -- Service : validate_access_token`));
            return _res.status(400).json({message: "Validate Token Error "}).redirect(_req.headers.referer);
        }
    }
;

export default validate_access_token;

/** asynchandler kullanırsam kodu yazarken try içindeymiş gibi yazarım ve error oluşursa catche gibi davranarak hatayı kendisi döner */
/** daha sonrasında throw new error yapısı ise benim dönülen hatayı özelleştirmemi sağlar , default hatadan ziyade benimkini kullanır */
/** error handler dosyası sayesimde oluşturduğum yapıyla birlikte benim belirlediğim statu koduna göre anlamlı bir json objesi şeklinde geriye döner. Eğer error handler kullanmazsam karmaşık bir html hatası döner. */