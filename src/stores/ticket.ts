import { defineStore } from 'pinia';

export interface Ticket {
    id: string;
    eventId: string;
    userId: string;
    name: string;
    price: number;
    createdAt: Date;
}

export const useTicketStore = defineStore('ticket', {
    state: () => ({
        tickets: [] as Ticket[]
    }),

    getters: {
        getTicketById: (state) => (id: string) => {
            return state.tickets.find(ticket => ticket.id === id);
        },

        getTicketsByEventId: (state) => (eventId: string) => {
            return state.tickets.filter(ticket => ticket.eventId === eventId);
        },

        getTicketsByUserId: (state) => (userId: string) => {
            return state.tickets.filter(ticket => ticket.userId === userId);
        },

        getAllTickets: (state) => state.tickets
    },

    actions: {
        addTicket(ticket: Ticket) {
            this.tickets.push(ticket);
        },

        updateTicket(id: string, updatedTicket: Partial<Ticket>) {
            const index = this.tickets.findIndex(t => t.id === id);
            if (index !== -1) {
                this.tickets[index] = { ...this.tickets[index], ...updatedTicket } as Ticket;
            }
        },

        deleteTicket(id: string) {
            this.tickets = this.tickets.filter(t => t.id !== id);
        }
    }
});