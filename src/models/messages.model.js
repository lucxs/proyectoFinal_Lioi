import mongoose from "mongoose"
const messageScheme = new mongoose.Schema({
        
        user:{
                type: String
        },
        
        message:{
                type: String
        }
        
        });

export const messageModel = mongoose.model("messages", messageScheme)