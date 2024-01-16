import mongoose from "mongoose";

const individual_user_schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone_number: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	privacy_policy: {
		type: Boolean,
		required: true,
		default: false,
	},
	terms_of_use: {
		type: Boolean,
		required: true,
		default: false,
	},
	register_method: {
		type: String,
		required: true,
		default: "onSite", // onSite, linkedin, github, google
	},
	register_type: {
		type: String,
		required: true,
		default: "regular", // free, premium , interview
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
		default: "PASSIVE",
	},
});

export default mongoose.model("Individual_User", individual_user_schema);
