import { defineStore } from 'pinia'

/* ---------------- TYPES ---------------- */

export type SessionType = 'drinks' | 'break' | 'lecture'
export type TicketType = 'regular' | 'vip'

export interface Session {
	id: string
	start: Date
	end: Date
	speakerId: string
	type: SessionType
	location: string
	title: string
	description: string
}

export interface TicketConfig {
	type: TicketType
	price: number
	quantity: number
}

export interface Event {
	id: string
	name: string
	description?: string
	image?: string
	maxAttendees: number
	sessions: Session[]
	tickets: TicketConfig[]
}

function toDate(value: Date | string): Date {
	return value instanceof Date ? value : new Date(value)
}

export const useEventStore = defineStore('event', {
	state: () => ({
		events: [] as Event[],
	}),

	persist: true,

	getters: {
		getEventById: (state) => (id: string) =>
			state.events.find(e => e.id === id),

		getAllEvents: (state) => state.events,
	},

	actions: {
		addEvent(event: Event) {
			this.events.push(event)
		},

		updateEvent(id: string, updated: Partial<Event>) {
			const index = this.events.findIndex(e => e.id === id)
			if (index === -1) return

			this.events[index] = {
				...this.events[index],
				...updated,
			} as Event;
		},

		deleteEvent(id: string) {
			this.events = this.events.filter(e => e.id !== id)
		},

		addSession(eventId: string, session: Session) {
			const event = this.getEventById(eventId)
			if (!event) return

			event.sessions.push({
				...session,
				start: toDate(session.start),
				end: toDate(session.end),
			})
		},

		updateSession(
			eventId: string,
			sessionId: string,
			updated: Partial<Session>
		) {
			const event = this.getEventById(eventId)
			if (!event) return

			const index = event.sessions.findIndex(s => s.id === sessionId)
			if (index === -1) return

			const existing = event.sessions[index]

			event.sessions[index] = {
				...existing,
				...updated,
				start: updated.start
					? toDate(updated.start)
					: existing?.start,
				end: updated.end
					? toDate(updated.end)
					: existing?.end,
			} as Session;
		},

		deleteSession(eventId: string, sessionId: string) {
			const event = this.getEventById(eventId)
			if (!event) return

			event.sessions = event.sessions.filter(s => s.id !== sessionId)
		},

		updateTicket(
			eventId: string,
			type: TicketType,
			updated: Partial<TicketConfig>
		) {
			const event = this.getEventById(eventId)
			if (!event) return

			const ticket = event.tickets.find(t => t.type === type)
			if (!ticket) return

			Object.assign(ticket, updated)
		},

		seedMockEvents() {
			if (this.events.length) return

			this.events.push({
				id: 'hackfront-2026',
				name: 'Hackfront Conference 2026',
				description:
					'Een dag vol talks, hackathons en netwerken voor developers.',
				image:
					'https://images.unsplash.com/photo-1518770660439-4636190af475',
				maxAttendees: 500,

				tickets: [
					{
						type: 'regular',
						price: 25,
						quantity: 400,
					},
					{
						type: 'vip',
						price: 75,
						quantity: 100,
					},
				],

				sessions: [
					{
						id: crypto.randomUUID(),
						title: 'Opening & Introductie',
						description: 'Welkom en uitleg van de dag',
						location: 'Zaal A',
						speakerId: '',
						type: 'lecture',
						start: new Date('2026-10-25T09:00:00'),
						end: new Date('2026-10-25T09:30:00'),
					},
					{
						id: crypto.randomUUID(),
						title: 'Hackathon',
						description: 'Teams werken aan real-life cases',
						location: 'Zaal C',
						speakerId: '',
						type: 'break',
						start: new Date('2026-10-25T11:00:00'),
						end: new Date('2026-10-25T15:30:00'),
					},
				],
			})
		},
	},
})
