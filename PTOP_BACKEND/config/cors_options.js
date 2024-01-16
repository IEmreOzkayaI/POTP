import allowed_origins from './allowed_origins.js';

const cors_options = {
    origin: (origin, callback) => {
        if (allowed_origins.includes(origin) || !origin) {
            callback(null, true)
        } else {
            console.log("origin",origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials:true
}

export default cors_options;