import messageDao from "../dao/messages.dao.js";
import messageService from "../services/message.service.js";

class MessageController{

constructor(){

    this.service = new messageService(messageDao);
}

async getMessages(){

        try {
                return await this.service.getMessages();
        } catch (error) {
                req.logger.error("Error message.controller: ",error);
        }

}

async addMessages(data){

        try {
                return await this.service.addMessages(data);
                
        } catch (error) {
                req.logger.error("Error message.addMessage: ",error);
        }

}


}

const msgController = new MessageController();

export default msgController;