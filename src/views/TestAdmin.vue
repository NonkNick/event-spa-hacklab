<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore, type Event, type Session, type SessionType } from '../stores/event'
import EventDisplay from '../components/EventDisplay.vue'

const eventStore = useEventStore()

const selectedEvent = ref<Event | null>(null)

const newEventName = ref('')
const newEventMax = ref<number>(100)

const sessionTitle = ref('')
const sessionLocation = ref('')
const sessionType = ref<SessionType>('lecture')
const sessionStart = ref('')
const sessionEnd = ref('')
const error = ref('')

/**
 * Normaliseert Date | string → Date
 * Nodig i.v.m. Pinia persisted state
 */
function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

// ADD EVENT
function createEvent() {
  if (!newEventName.value) return

  const event: Event = {
    id: crypto.randomUUID(),
    name: newEventName.value,
    maxAttendees: newEventMax.value,
    sessions: []
  }

  eventStore.addEvent(event)
  newEventName.value = ''
  newEventMax.value = 100
}

// SELECT EVENT
function selectEvent(event: Event) {
  selectedEvent.value = event
}

// ADD SESSION
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

  // overlap check (persist-safe)
  const overlap = selectedEvent.value.sessions.some(s => {
    const sStart = toDate(s.start)
    const sEnd = toDate(s.end)
    return start < sEnd && end > sStart
  })

  if (overlap) {
    error.value = 'Session overlapt met bestaande session'
    return
  }

  const session: Session = {
    id: crypto.randomUUID(),
    title: sessionTitle.value,
    description: '',
    location: sessionLocation.value,
    speakerId: '',
    type: sessionType.value,
    start,
    end
  }

  selectedEvent.value.sessions.push(session)

  // reset form
  sessionTitle.value = ''
  sessionLocation.value = ''
  sessionStart.value = ''
  sessionEnd.value = ''
  error.value = ''
}

// EDIT SESSION
function editSession(s: Session) {
  sessionTitle.value = s.title
  sessionLocation.value = s.location
  sessionType.value = s.type
  sessionStart.value = formatTime(s.start)
  sessionEnd.value = formatTime(s.end)

  deleteSession(s.id)
}

// DELETE SESSION
function deleteSession(sessionId: string) {
  if (!selectedEvent.value) return
  selectedEvent.value.sessions =
    selectedEvent.value.sessions.filter(s => s.id !== sessionId)
}

// HELPERS
function timeToDate(time: string): Date {
  const [h = '0', m = '0'] = time.split(':')
  const d = new Date()
  d.setHours(Number(h), Number(m), 0, 0)
  return d
}

function formatTime(value: Date | string): string {
  return toDate(value).toTimeString().slice(0, 5)
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">

    <h1 class="text-3xl font-bold">Event Admin Demo</h1>

    <!-- ADD EVENT -->
    <section class="bg-white p-4 rounded shadow space-y-2">
      <h2 class="text-xl font-semibold">Nieuw event</h2>

      <input v-model="newEventName" placeholder="Event naam" class="border p-2 rounded w-full" />

      <input v-model.number="newEventMax" type="number" placeholder="Max bezoekers" class="border p-2 rounded w-full" />

      <button @click="createEvent" class="bg-orange-500 text-white px-4 py-2 rounded">
        Add Event
      </button>
    </section>

    <!-- EVENT LIST -->
    <section class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">Events</h2>

      <ul class="space-y-2">
        <li v-for="event in eventStore.events" :key="event.id" @click="selectEvent(event)"
          class="p-2 border rounded cursor-pointer hover:bg-orange-100"
          :class="{ 'bg-orange-200': selectedEvent?.id === event.id }">
          {{ event.name }} — {{ event.sessions.length }} sessies
        </li>
      </ul>
    </section>

    <!-- ADD SESSION -->
    <section v-if="selectedEvent" class="bg-white p-4 rounded shadow space-y-2">
      <h2 class="text-xl font-semibold">
        Session toevoegen aan: {{ selectedEvent.name }}
      </h2>

      <input v-model="sessionTitle" placeholder="Titel" class="border p-2 rounded w-full" />
      <input v-model="sessionLocation" placeholder="Locatie" class="border p-2 rounded w-full" />

      <select v-model="sessionType" class="border p-2 rounded w-full">
        <option value="lecture">Lecture</option>
        <option value="break">Break</option>
        <option value="drinks">Drinks</option>
      </select>

      <input type="time" v-model="sessionStart" class="border p-2 rounded w-full" />
      <input type="time" v-model="sessionEnd" class="border p-2 rounded w-full" />

      <button @click="addSession" class="bg-green-600 text-white px-4 py-2 rounded">
        Add Session
      </button>

      <p v-if="error" class="text-red-600">{{ error }}</p>
    </section>

    <!-- SESSION LIST & EDIT/DELETE -->
    <section v-if="selectedEvent?.sessions.length" class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Sessies</h2>

      <ul class="space-y-2">
        <li v-for="s in selectedEvent.sessions" :key="s.id"
          class="p-2 border rounded flex justify-between items-center">
          <div>
            <div class="font-bold">{{ s.title }}</div>
            <div class="text-sm text-gray-600">{{ formatTime(s.start) }} – {{ formatTime(s.end) }} | {{ s.location }}
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="editSession(s)" class="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
            <button @click="deleteSession(s.id)" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- TIMELINE -->
    <section v-if="selectedEvent" class="bg-white p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Timeline</h2>
      <div class="h-[500px]">
        <EventDisplay :event="selectedEvent" />
      </div>
    </section>

  </div>
</template>