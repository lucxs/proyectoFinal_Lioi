import { TicketModel } from "../models/ticket.model.js"; 

class TicketDAO{

    constructor(){
        this.model = TicketModel;

    }

    async getTickets(){

        return await this.model.find().lean()

}

async createTicket(data){

        return await this.model.create(data)

}
}

const ticketDAO = new TicketDAO();

export default ticketDAO