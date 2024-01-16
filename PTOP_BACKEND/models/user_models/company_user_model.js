import mongoose from "mongoose";

const company_user_schema = new mongoose.Schema({
	name: {
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
	},
	terms_of_use: {
		type: Boolean,
		required: true,
	},
	industry: {
		type: String,
		required: true,
	},
	employee_count: {
		type: String,
		required: true,
	},
	web_site: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: false,
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

export default mongoose.model("Company_User", company_user_schema);
