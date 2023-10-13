import { ticketModel } from "../dao/models/ticket.model.js";

class TicketService {
    async createTicket(data) {
      try {
        console.log("Datos del ticket antes de crear:", data);
        
        if (!data.code || !data.purchase_datetime || !data.amount || !data.purchaser) {
          console.error("Datos incompletos:", data);
          throw new Error('Datos incompletos para crear el ticket.');
        }
  
        const ticket = new ticketModel(data);
        await ticket.save();
  
        console.log("Ticket creado:", ticket);
        return ticket;
      } catch (error) {
        console.error('Error al crear el ticket:', error);
        throw error;
      }
    }
  }
  
export default TicketService;
