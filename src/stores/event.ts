import { defineStore } from "pinia";

export type SessionType = "drinks" | "break" | "lecture";

export interface Session {
	id: string;
	start: Date;
	end: Date;
	speakerId: string;
	type: SessionType;
	location: string;
	title: string;
	description: string;
}

export interface Event {
	id: string;
	name: string;
	maxAttendees: number;
	sessions: Session[];
}

export const useEventStore = defineStore("event", {
	state: () => ({
		events: [] as Event[],
	}),
	persist: true,

	getters: {
		getEventById: (state) => (id: string) => {
			return state.events.find((event) => event.id === id);
		},

		getAllEvents: (state) => state.events,
	},

	actions: {
		addEvent(event: Event) {
			this.events.push(event);
		},

		updateEvent(id: string, updatedEvent: Partial<Event>) {
			const index = this.events.findIndex((e) => e.id === id);
			if (index !== -1) {
				this.events[index] = {
					...this.events[index],
					...updatedEvent,
				} as Event;
			}
		},

		deleteEvent(id: string) {
			this.events = this.events.filter((e) => e.id !== id);
		},
	},
});
