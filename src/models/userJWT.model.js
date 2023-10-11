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
	password: String,
	cart: {
		type: mongoose.Schema.Types.ObjectId,
         ref: 'carts',
		 required:true
	},
	role:{
		type:String,
		default:'user'
	}

})

export const UsersModel = mongoose.model("usersJWT", userSchema)

