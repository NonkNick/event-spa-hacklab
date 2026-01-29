import { defineStore } from 'pinia'

interface Ticket {
    id: string
    eventId: string
    userId: string
    name: string
    price: number
    createdAt: string
}

export const useTicketStore = defineStore('tickets', {
    state: () => ({
        tickets: [] as Ticket[]
    }),

    getters: {
        // Get all tickets
        all: (state) => state.tickets,

        getById: (state) => (id: string) =>
            state.tickets.find(t => t.id === id),

        // Get tickets by event ID
        byEventId: (state) => (eventId: string) =>
            state.tickets.filter(t => t.eventId === eventId),

        // Get tickets by user ID
        byUserId: (state) => (userId: string) =>
            state.tickets.filter(t => t.userId === userId),

        // Get sold count for event
        soldCount: (state) => (eventId: string) =>
            state.tickets.filter(t => t.eventId === eventId).length
    },

    actions: {
        // Set all tickets
        setTickets(tickets: Ticket[]) {
            this.tickets = tickets
        },

        // Add ticket
        addTicket(ticket: Ticket) {
            this.tickets.push(ticket)
        },

        // Create ticket
        createTicket(eventId: string, userId: string, name: string, price: number) {
            const ticket: Ticket = {
                id: `ticket-${Date.now()}-${Math.random()}`,
                eventId,
                userId,
                name,
                price,
                createdAt: new Date().toISOString()
            }
            this.tickets.push(ticket)
            return ticket
        },

        // Remove ticket
        removeTicket(id: string) {
            this.tickets = this.tickets.filter(t => t.id !== id)
        }
    }
})