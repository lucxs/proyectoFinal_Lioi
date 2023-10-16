import mongoose from "mongoose";

const loggingsControlSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		index: true, 
	},
	date: Date
})

export const loggingsControlModel = mongoose.model("loggingsControl", loggingsControlSchema)