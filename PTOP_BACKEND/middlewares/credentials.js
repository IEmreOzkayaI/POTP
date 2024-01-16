import allowed_origins from '../config/allowed_origins.js';

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowed_origins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}


export default credentials;