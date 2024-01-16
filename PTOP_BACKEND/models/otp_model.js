import mongoose from "mongoose";

const otp_schema = new mongoose.Schema({

    individual_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Individual_User",
    },
    verification_code: {
        type: String,
        required: true,
    },

    createdAt: { type: Date, expires: '1m', default: Date.now }, // 1 dakika sonra silinmesi için

});

export default mongoose.model("OTP", otp_schema);
