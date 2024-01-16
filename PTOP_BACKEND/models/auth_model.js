import mongoose from "mongoose";

const auth_schema = new mongoose.Schema({
    individual_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Individual_User",
    },
    refresh_token: {
        type: String,
        required: false,
    },
    otp_secret_key: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

auth_schema.index({created_at: 1}, {expireAfterSeconds: 60 * 60 * 24 * 1});


export default mongoose.model("Auth", auth_schema);
