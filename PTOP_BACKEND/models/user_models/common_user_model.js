import mongoose from "mongoose";

const common_user_schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		required: true,
	},
	user_id: {
		type: String,
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model("Common_User", common_user_schema);
