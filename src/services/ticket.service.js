export default class TicketServices {

    constructor(dao){

       this.dao = dao
    }

    
     async getTickets(){

             return await this.dao.getTickets();
             
     }

     async getTicketByCode(data){

      return await this.dao.getTicketByCode(data);
      
}

     

     async createTicket(data){
        
        return await this.dao.createTicket(data);
     }

    }