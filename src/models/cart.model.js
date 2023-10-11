import mongoose from "mongoose";

const cartScheme = new mongoose.Schema({

	title: {
		default:'user',
		type: String
	},

	quantity:{
		default: 0,
		type: Number
		
	},
	
    products: [
		{
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products',
						
                    },
					quantity:{
						type: Number
					}
				}
                
				]

})

export const cartModel = mongoose.model("carts", cartScheme)