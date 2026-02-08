<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useEventStore } from '../stores/event'
import type { Event, Session, TicketType } from '../stores/event'
import { useSpeakerStore } from '../stores/speaker'

const speakerStore = useSpeakerStore()
const speakers = computed(() => speakerStore.speakers)
/* ================= Props & Emits ================= */
const props = defineProps<{ eventId: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

/* ================= Store ================= */
const eventStore = useEventStore()

/* ================= Local state ================= */
const currentEventId = ref<string | null>(null)

const eventName = ref('')
const maxAttendees = ref(0)

const newSession = ref({
  title: '',
  start: '',
  end: '',
  location: '',
  speakerId: ''
})

const newTicket = ref({
  name: 'REGULAR' as 'REGULAR' | 'VIP',
  price: 0,
  amount: 1
})

/* ================= Watch ================= */
watch(
  () => props.eventId,
  (val) => {
    if (val === 'new') {
      currentEventId.value = null
      eventName.value = ''
      maxAttendees.value = 0
    } else {
      currentEventId.value = val
      const e = eventStore.events.find(e => e.id === val)
      if (e) {
        eventName.value = e.name
        maxAttendees.value = e.maxAttendees
      }
    }
  },
  { immediate: true }
)

/* ================= Computed ================= */
const event = computed<Event | null>(() => {
  if (!currentEventId.value) return null
  return eventStore.events.find(e => e.id === currentEventId.value) ?? null
})

/* ================= Methods ================= */
function closeModal() {
  emit('close')
}

/* ---------- Event ---------- */
function saveEvent() {
  if (!eventName.value) return

  if (event.value) {
    eventStore.updateEvent(event.value.id, {
      name: eventName.value,
      maxAttendees: maxAttendees.value
    })
  } else {
    const id = crypto.randomUUID()

    eventStore.addEvent({
      id,
      name: eventName.value,
      maxAttendees: maxAttendees.value,
      sessions: [],
      tickets: []
    })

    currentEventId.value = id
  }
}

/* ---------- Sessions ---------- */
function addSession() {
  if (!event.value) return
  if (!newSession.value.title || !newSession.value.start || !newSession.value.end || !newSession.value.location) return

  const session: Session = {
    id: crypto.randomUUID(),
    title: newSession.value.title,
    start: new Date(newSession.value.start),
    end: new Date(newSession.value.end),
    location: newSession.value.location,
    speakerId: newSession.value.speakerId || undefined
  }

  eventStore.addSession(event.value.id, session)
  newSession.value = { title: '', start: '', end: '', location: '' , speakerId: '' }
}

function deleteSession(sessionId: string) {
  if (!event.value) return
  eventStore.deleteSession(event.value.id, sessionId)
}

/* ---------- Tickets ---------- */
function addTicket() {
  if (!event.value) return
  if (newTicket.value.price <= 0 || newTicket.value.amount <= 0) return

  const ticket: TicketType = {
    id: crypto.randomUUID(),
    name: newTicket.value.name,
    price: newTicket.value.price,
    amount: newTicket.value.amount
  }

  eventStore.addTicket(event.value.id, ticket)
  newTicket.value = { name: 'REGULAR', price: 0, amount: 1 }
}

function deleteTicket(ticketId: string) {
  if (!event.value) return
  eventStore.deleteTicket(event.value.id, ticketId)
}

/* ---------- Helper ---------- */
function formatTime(date: string | Date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-[#2A263A] p-6 rounded-xl w-full max-w-5xl relative overflow-y-auto max-h-[90vh]">

      <button @click="closeModal" class="absolute top-3 right-3 text-xl font-bold">✕</button>

      <h2 class="text-2xl font-bold mb-4">
        {{ event ? 'Event bewerken' : 'Nieuw event aanmaken' }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input v-model="eventName" placeholder="Event naam" class="p-2 border rounded" />
        <input v-model.number="maxAttendees" type="number" placeholder="Max bezoekers" class="p-2 border rounded" />
      </div>

      <button @click="saveEvent" class="mb-6 bg-[#FF8A3D] text-white px-4 py-2 rounded">
        {{ event ? 'Event opslaan' : 'Event aanmaken' }}
      </button>

      <div v-if="event">

        <!-- Sessions -->
        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-2">Sessions</h3>

          <ul class="mb-2 space-y-1">
            <li v-for="s in event.sessions" :key="s.id" class="flex justify-between">
              <span>
                {{ s.title }} — {{ formatTime(s.start) }} - {{ formatTime(s.end) }} ({{ s.location }})
              </span>
              <button @click="deleteSession(s.id)" class="text-red-500 text-sm">Verwijder</button>
            </li>
          </ul>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input v-model="newSession.title" placeholder="Titel" class="p-2 border rounded" />
            <input v-model="newSession.start" type="datetime-local" class="p-2 border rounded" />
            <input v-model="newSession.end" type="datetime-local" class="p-2 border rounded" />
            <input v-model="newSession.location" placeholder="Locatie" class="p-2 border rounded" />
            <select v-model="newSession.speakerId" class="p-2 border rounded">
  <option disabled value="">-- kies spreker --</option>
  <option
    v-for="speaker in speakers"
    :key="speaker.id"
    :value="speaker.id"
  >
    {{ speaker.name }}
  </option>
</select>
          </div>

          <button @click="addSession" class="mt-2 bg-[#FF8A3D] text-white px-3 py-2 rounded">
            + Add Session
          </button>
        </section>

        <!-- Tickets -->
        <section>
          <h3 class="text-xl font-semibold mb-2">Tickets</h3>

          <ul class="mb-2 space-y-1">
            <li v-for="t in event.tickets" :key="t.id" class="flex justify-between">
              <span>{{ t.name }} — €{{ t.price }} ({{ t.amount }})</span>
              <button @click="deleteTicket(t.id)" class="text-red-500 text-sm">Verwijder</button>
            </li>
          </ul>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select v-model="newTicket.name" class="p-2 border rounded">
              <option value="REGULAR">REGULAR</option>
              <option value="VIP">VIP</option>
            </select>
            <input v-model.number="newTicket.price" type="number" placeholder="Prijs" class="p-2 border rounded" />
            <input v-model.number="newTicket.amount" type="number" placeholder="Aantal" class="p-2 border rounded" />
          </div>

          <button @click="addTicket" class="mt-2 bg-[#FF8A3D] text-white px-3 py-2 rounded">
            + Add Ticket
          </button>
        </section>

      </div>
    </div>
  </div>
</template>