export default class TicketServices {

    constructor(dao){

       this.dao = dao
    }

    
     async getTickets(){

             return await this.dao.getTickets();
             
     }

     async createTicket(data){
        
        return await this.dao.createTicket(data);
     }

    }