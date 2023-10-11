import { messageModel } from "../models/messages.model.js";

class MessageDAO{

    constructor(){
        this.model = messageModel;

    }

    async getMessages(){

        return await this.model.find().lean()

}

async addMessages(data){

    try {

        return await this.model.create(data);
        
    } catch (error) {

        req.logger.error("Hubo un error al enviar el mensaje - capa message dao",error);
        
    }

}

}

const messageDao = new MessageDAO();

export default messageDao