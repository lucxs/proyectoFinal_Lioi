import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	password: String
})

export const UsersModel = mongoose.model("users", userSchema)

