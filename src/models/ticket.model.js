import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
code:{
    type: Number,
    unique:true,
    require:true
},
purcharse_datatime:Date,
amount:Number,
purcharser:String
})

export const TicketModel = mongoose.model("ticket", ticketSchema)