// stores/event.ts
import { defineStore } from 'pinia'

interface Event {
    id: string
    name: string
    maxAttendees: number
    sessions: Session[]
}

interface Session {
    id: string
    start: string
    end: string
    type: 'drinking' | 'break' | 'lecture'
    location: string
}

export const useEventStore = defineStore('events', {
    state: () => ({
        events: [] as Event[]
    }),

    getters: {
        // Get all events
        all: (state) => state.events,

        // Get event by ID
        getById: (state) => (id: string) =>
            state.events.find(e => e.id === id),

        // Get session by ID across all events
        getSessionById: (state) => (sessionId: string) => {
            for (const event of state.events) {
                const session = event.sessions.find(s => s.id === sessionId)
                if (session) return session
            }
            return null
        }
    },

    actions: {
        // Set all events
        setEvents(events: Event[]) {
            this.events = events
        },

        // Add event
        addEvent(event: Event) {
            this.events.push(event)
        },

        // Update event
        updateEvent(id: string, data: Partial<Event>) {
            const index = this.events.findIndex(e => e.id === id)
            if (index !== -1) {
                this.events[index] = { ...this.events[index], ...data }
            }
        },

        // Remove event
        removeEvent(id: string) {
            this.events = this.events.filter(e => e.id !== id)
        },

        // Add session to event
        addSession(eventId: string, session: Session) {
            const event = this.events.find(e => e.id === eventId)
            if (event) event.sessions.push(session)
        },

        // Update session
        updateSession(eventId: string, sessionId: string, data: Partial<Session>) {
            const event = this.events.find(e => e.id === eventId)
            if (event) {
                const index = event.sessions.findIndex(s => s.id === sessionId)
                if (index !== -1) {
                    event.sessions[index] = { ...event.sessions[index], ...data }
                }
            }
        },

        // Remove session
        removeSession(eventId: string, sessionId: string) {
            const event = this.events.find(e => e.id === eventId)
            if (event) {
                event.sessions = event.sessions.filter(s => s.id !== sessionId)
            }
        }
    }
})