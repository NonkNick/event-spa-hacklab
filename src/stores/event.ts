import { defineStore } from 'pinia'

/* ================= TYPES ================= */
export type SessionType = "drinks" | "break" | "lecture";

export interface Session {
  id: string
  title: string
  start: Date
  end: Date
  type?: SessionType
  location: string
  speakerId?: string
}

export interface TicketType {
  id: string
  name: 'VIP' | 'REGULAR'
  price: number
  amount: number
}

export interface Event {
  id: string
  name: string
  maxAttendees: number
  sessions: Session[]
  tickets: TicketType[]
}

/* ================= STORE ================= */

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[]
  }),

  actions: {
    /* ---------- MOCK DATA ---------- */

    seedMockEvents() {
      if (this.events.length) return

      this.events.push({
        id: crypto.randomUUID(),
        name: 'Hackfront Conference 2026',
        maxAttendees: 150,
        sessions: [
          {
            id: crypto.randomUUID(),
            title: 'Opening Keynote',
            start: new Date('2026-10-25T09:00'),
            end: new Date('2026-10-25T10:00'),
            location: 'Zaal A'
          }
        ],
        tickets: [
          {
            id: crypto.randomUUID(),
            name: 'REGULAR',
            price: 10,
            amount: 100
          }
        ]
      })
    },

    /* ---------- EVENTS ---------- */

    addEvent(event: Event) {
      this.events.push(event)
    },

    deleteEvent(eventId: string) {
      this.events = this.events.filter(e => e.id !== eventId)
    },

    updateEvent(eventId: string, updated: Partial<Omit<Event, 'id'>>) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return
      Object.assign(event, updated)
    },

    /* ---------- SESSIONS ---------- */

    addSession(eventId: string, session: Session) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      event.sessions.push(normalizeSession(session))
    },

    deleteSession(eventId: string, sessionId: string) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      event.sessions = event.sessions.filter(s => s.id !== sessionId)
    },

    updateSession(
      eventId: string,
      sessionId: string,
      updated: Partial<Session>
    ) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      const session = event.sessions.find(s => s.id === sessionId)
      if (!session) return

      Object.assign(session, {
        ...updated,
        ...(updated.start && { start: new Date(updated.start) }),
        ...(updated.end && { end: new Date(updated.end) })
      })
    },

    /* ---------- TICKETS ---------- */

    addTicket(eventId: string, ticket: TicketType) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      event.tickets.push(ticket)
    },

    deleteTicket(eventId: string, ticketId: string) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      event.tickets = event.tickets.filter(t => t.id !== ticketId)
    },

    updateTicket(
      eventId: string,
      ticketId: string,
      updated: Partial<TicketType>
    ) {
      const event = this.events.find(e => e.id === eventId)
      if (!event) return

      const ticket = event.tickets.find(t => t.id === ticketId)
      if (!ticket) return

      Object.assign(ticket, updated)
    }
  },

  persist: true
})

/* ================= HELPERS ================= */

function normalizeSession(session: Session): Session {
  return {
    ...session,
    start: new Date(session.start),
    end: new Date(session.end)
  }
}
