<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore, type Event, type Session, type SessionType } from '../stores/event'
import EventDisplay from './EventDisplay.vue'
import { useSpeakerStore } from '../stores/speaker'

const eventStore = useEventStore()
const speakerStore = useSpeakerStore()
const speakers = speakerStore.speakers

const open = ref(false)
const selectedEvent = ref<Event | null>(null)

const newEventName = ref('')
const newEventMax = ref(100)

const sessionTitle = ref('')
const sessionLocation = ref('')
const newEventImage = ref('')
const newEventDescription = ref('')
const sessionType = ref<SessionType>('lecture')
const sessionSpeakerId = ref<string>('')
sessionSpeakerId.value = ''
const sessionStart = ref('')
const sessionEnd = ref('')
const error = ref('')

function totalTickets() {
	if (!selectedEvent.value) return 0
	return selectedEvent.value.tickets.reduce(
		(sum, t) => sum + t.quantity,
		0
	)
}

function updateTicket(type: 'vip' | 'regular', field: 'price' | 'quantity', value: number) {
	if (!selectedEvent.value) return

	const ticket = selectedEvent.value.tickets.find(t => t.type === type)
	if (!ticket) return

	ticket[field] = value

	if (totalTickets() > selectedEvent.value.maxAttendees) {
		error.value = 'Totaal aantal tickets is groter dan max bezoekers'
	} else {
		error.value = ''
	}
}

function toDate(value: Date | string): Date {
	return value instanceof Date ? value : new Date(value)
}

function openNewEvent() {
	selectedEvent.value = null
	open.value = true
}

function openEvent(event: Event) {
	selectedEvent.value = event
	open.value = true
}

function close() {
	open.value = false
	selectedEvent.value = null
	error.value = ''
}

function createEvent() {
	if (!newEventName.value) return

	const event: Event = {
		id: crypto.randomUUID(),
		name: newEventName.value,
		description: newEventDescription.value,
		image: newEventImage.value || undefined,
		maxAttendees: newEventMax.value,
		sessions: [],
		tickets: [
			{
				type: 'regular',
				price: 25,
				quantity: newEventMax.value - 50,
			},
			{
				type: 'vip',
				price: 75,
				quantity: 50,
			},
		],
	}

	eventStore.addEvent(event)

	newEventName.value = ''
	newEventMax.value = 100
	selectedEvent.value = event
}

function addSession() {
	if (!selectedEvent.value) return

	if (!sessionTitle.value || !sessionStart.value || !sessionEnd.value) {
		error.value = 'Alle velden invullen'
		return
	}

	const start = timeToDate(sessionStart.value)
	const end = timeToDate(sessionEnd.value)

	if (end <= start) {
		error.value = 'Eindtijd moet later zijn dan starttijd'
		return
	}

	const overlap = selectedEvent.value.sessions.some(s => {
		const sStart = toDate(s.start)
		const sEnd = toDate(s.end)
		return start < sEnd && end > sStart
	})

	if (overlap) {
		error.value = 'Session overlapt met bestaande session'
		return
	}

	selectedEvent.value.sessions.push({
		id: crypto.randomUUID(),
		title: sessionTitle.value,
		description: '',
		location: sessionLocation.value,
		speakerId: sessionSpeakerId.value,
		type: sessionType.value,
		start,
		end
	})

	sessionTitle.value = ''
	newEventDescription.value = ''
	newEventImage.value = ''
	sessionLocation.value = ''
	sessionStart.value = ''
	sessionEnd.value = ''
	error.value = ''
}

function editSession(s: Session) {
	sessionTitle.value = s.title
	sessionLocation.value = s.location
	sessionType.value = s.type
	sessionSpeakerId.value = s.speakerId
	sessionStart.value = formatTime(s.start)
	sessionEnd.value = formatTime(s.end)
	deleteSession(s.id)
}

function deleteSession(id: string) {
	if (!selectedEvent.value) return
	selectedEvent.value.sessions =
		selectedEvent.value.sessions.filter(s => s.id !== id)
}

function timeToDate(time: string): Date {
	const [h = '0', m = '0'] = time.split(':')
	const d = new Date()
	d.setHours(Number(h), Number(m), 0, 0)
	return d
}

function formatTime(value: Date | string): string {
	return toDate(value).toTimeString().slice(0, 5)
}

defineExpose({ openNewEvent, openEvent })

const inputClass =
	'w-full rounded-xl px-4 py-2 text-sm transition ' +
	'bg-[#F9F7F3] text-[#1F1D2B] placeholder-black/40 ' +
	'border border-black/10 ' +
	'focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/50 focus:border-[#FF8A3D] ' +
	'dark:bg-[#1A1726] dark:text-[#F3ECDD] dark:placeholder-white/40 dark:border-white/10'
</script>

<template>
	<div v-if="open" class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
		<div
			class="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl p-6
			bg-white dark:bg-[#2A263A] shadow-xl space-y-6"
		>

			<div class="flex justify-between items-center">
				<h2 class="text-2xl font-bold">
					{{ selectedEvent ? selectedEvent.name : 'Nieuw event' }}
				</h2>

				<button
					@click="close"
					class="text-xl opacity-60 hover:opacity-100 transition"
				>
					✕
				</button>
			</div>

			<section v-if="!selectedEvent" class="space-y-3">
				<label>Naam</label>
				<input
					v-model="newEventName"
					placeholder="Event naam"
					:class="inputClass"
				/>

				<label>Spreker</label>
				<select
						v-model="sessionSpeakerId"
						:class="inputClass"
						>
						<option value="">Geen spreker</option>

						<option
							v-for="speaker in speakers"
							:key="speaker.id"
							:value="speaker.id"
						>
							{{ speaker.name }}
						</option>
				</select>

				<section v-if="!selectedEvent">
				<label>Beschrijving</label>
				<textarea
					v-model="newEventDescription"
					placeholder="Beschrijving van het evenement"
					:class="inputClass"
				></textarea>
				</section>

				<label>Afbeelding</label>
				<input
					v-model="newEventImage"
					placeholder="Afbeeldings-URL (optioneel)"
					:class="inputClass"
				/>

				<label>Max bezoekers</label>
				<input
					v-model.number="newEventMax"
					type="number"
					placeholder="Max bezoekers"
					:class="inputClass"
				/>

				<button
					@click="createEvent"
					class="px-5 py-2 rounded-lg
					bg-[#FF8A3D] hover:bg-[#E6752F]
					text-white text-sm font-semibold transition"
				>
					Event aanmaken
				</button>
			</section>

			<section v-if="selectedEvent" class="grid grid-cols-1 lg:grid-cols-2 gap-6">

				<div class="space-y-4">
					<h3 class="font-semibold text-lg">Session toevoegen</h3>

					<input v-model="sessionTitle" placeholder="Titel" :class="inputClass" />
					<input v-model="sessionLocation" placeholder="Locatie" :class="inputClass" />

					<select v-model="sessionType" :class="inputClass">
						<option value="lecture">Lecture</option>
						<option value="break">Break</option>
						<option value="drinks">Drinks</option>
					</select>

					<div class="grid grid-cols-2 gap-3">
						<input type="time" v-model="sessionStart" :class="inputClass" />
						<input type="time" v-model="sessionEnd" :class="inputClass" />
					</div>

					<button
						@click="addSession"
						class="px-5 py-2 rounded-lg
						bg-[#FF8A3D] hover:bg-[#E6752F]
						text-white text-sm font-semibold transition"
					>
						Session toevoegen
					</button>

					<p v-if="error" class="text-sm text-red-500 font-medium">
						{{ error }}
					</p>
				</div>

				<div class="space-y-4">
					<h3 class="font-semibold text-lg">Sessies</h3>

					<ul class="space-y-3">
						<li
							v-for="s in selectedEvent.sessions"
							:key="s.id"
							class="rounded-xl p-4
							bg-black/5 dark:bg-white/5
							flex justify-between items-center"
						>
							<div>
								<div class="font-semibold">{{ s.title }}</div>
								<div class="text-sm opacity-60">
									{{ formatTime(s.start) }} – {{ formatTime(s.end) }} • {{ s.location }}
								</div>
							</div>

							<div class="flex gap-2">
								<button
									@click="editSession(s)"
									class="px-3 py-1 rounded-lg text-sm
									bg-black/10 hover:bg-black/20
									dark:bg-white/10 dark:hover:bg-white/20"
								>
									Edit
								</button>

								<button
									@click="deleteSession(s.id)"
									class="px-3 py-1 rounded-lg text-sm
									bg-red-500 hover:bg-red-600
									text-white"
								>
									Delete
								</button>
							</div>
						</li>
					</ul>
				</div>
			</section>

      <section v-if="selectedEvent" class="space-y-4">
        <h3 class="font-semibold text-lg">Tickets</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div class="rounded-xl p-4 bg-black/5 dark:bg-white/5 space-y-3">
            <h4 class="font-semibold">Regular ticket</h4>

            <div>
              <label class="text-sm opacity-70">Prijs (€)</label>
              <input
                type="number"
                min="0"
                :class="inputClass"
                :value="selectedEvent.tickets.find(t => t.type === 'regular')?.price"
				@change="updateTicket(
					'regular',
					'price',
					selectedEvent.tickets.find(t => t.type === 'regular')!.price
				)"
              />
            </div>

            <div>
              <label class="text-sm opacity-70">Aantal</label>
              <input
                type="number"
                min="0"
                :class="inputClass"
                :value="selectedEvent.tickets.find(t => t.type === 'regular')?.quantity"
				@change="updateTicket(
					'regular',
					'price',
					selectedEvent.tickets.find(t => t.type === 'regular')!.price
				)"
              />
            </div>
          </div>

          <div class="rounded-xl p-4 bg-black/5 dark:bg-white/5 space-y-3">
            <h4 class="font-semibold">VIP ticket</h4>

            <div>
              <label class="text-sm opacity-70">Prijs (€)</label>
              <input
                type="number"
                min="0"
                :class="inputClass"
                :value="selectedEvent.tickets.find(t => t.type === 'vip')?.price"
				@change="updateTicket(
					'regular',
					'price',
					selectedEvent.tickets.find(t => t.type === 'regular')!.price
				)"
              />
            </div>

            <div>
              <label class="text-sm opacity-70">Aantal</label>
              <input
                type="number"
                min="0"
                :class="inputClass"
                :value="selectedEvent.tickets.find(t => t.type === 'vip')?.quantity"
				@change="updateTicket(
					'regular',
					'price',
					selectedEvent.tickets.find(t => t.type === 'regular')!.price
				)"
              />
            </div>
          </div>
        </div>

        <p class="text-sm opacity-70">
          Totaal tickets: <strong>{{ totalTickets() }}</strong> /
          {{ selectedEvent.maxAttendees }}
        </p>
      </section>

			<section v-if="selectedEvent" class="h-[400px] rounded-xl overflow-hidden">
				<h3 class="font-semibold text-lg pb-5">Programma</h3>
				<EventDisplay :event="selectedEvent" />
			</section>
		</div>
	</div>
</template>
