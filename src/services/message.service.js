
export default class messageService{

        constructor(dao){


                this.dao = dao;

        }

        async getMessages(){

                try {

                return await this.dao.getMessages()  

                } catch (error) {
                        req.logger.error("Error getMessages.services: ",error);
                        
                }

                
        }

        async addMessages(data){

                try {
                        return await this.dao.addMessages(data) 
                        
                } catch (error) {

                        req.logger.error("Error addMessage.services: ",error);                        
                }
                               
        }

}

