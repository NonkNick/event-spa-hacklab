<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Event, Session, TicketType } from '../stores/event'
import { useSpeakerStore } from '../stores/speaker'
import { useEventStore } from '../stores/event'

interface LocalSession extends Omit<Session, 'start' | 'end'> {
  start: string
  end: string
}

interface LocalTicket extends TicketType {}

const props = defineProps<{
  event: Event | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', event: Event): void
}>()

// STORES
const eventStore = useEventStore()
const speakerStore = useSpeakerStore()

const localName = ref(props.event?.name ?? '')
const localMaxAttendees = ref(props.event?.maxAttendees ?? 0)
const localSessions = ref<LocalSession[]>([])
const localTickets = ref<LocalTicket[]>([])

// SPEAKER DROPDOWN
const speakers = computed(() => speakerStore.speakers)

// Watch prop event to populate local reactive copies
watch(
  () => props.event,
  (evt) => {
    if (evt) {
      localName.value = evt.name
      localMaxAttendees.value = evt.maxAttendees
      localSessions.value = evt.sessions.map(s => ({
        ...s,
        start: s.start.toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
        end: s.end.toISOString().slice(0, 16)
      }))
      localTickets.value = [...evt.tickets]
    } else {
      localName.value = ''
      localMaxAttendees.value = 0
      localSessions.value = []
      localTickets.value = []
    }
  },
  { immediate: true }
)

// METHODS
function addSession() {
  localSessions.value.push({
    id: crypto.randomUUID(),
    title: '',
    start: new Date().toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16),
    location: '',
    type: 'lecture',
    speakerId: ''
  })
}

function removeSession(index: number) {
  localSessions.value.splice(index, 1)
}

function addTicket() {
  localTickets.value.push({
    id: crypto.randomUUID(),
    name: 'REGULAR',
    price: 0,
    amount: 1
  })
}

function removeTicket(index: number) {
  localTickets.value.splice(index, 1)
}

function saveEvent() {
  if (!props.event) return

  // Convert localSessions back to Date
  const updatedEvent: Event = {
    ...props.event,
    name: localName.value,
    maxAttendees: localMaxAttendees.value,
    sessions: localSessions.value.map(s => ({
      ...s,
      start: new Date(s.start),
      end: new Date(s.end)
    })),
    tickets: [...localTickets.value]
  }

  emit('save', updatedEvent)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-[#2A263A] rounded-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
      <h2 class="text-2xl font-bold mb-4">
        {{ props.event ? 'Edit Event' : 'Nieuw Event' }}
      </h2>

      <div class="space-y-4">
        <!-- Event name -->
        <div>
          <label class="block font-semibold mb-1">Naam</label>
          <input v-model="localName" type="text" class="w-full border rounded px-2 py-1" />
        </div>

        <!-- Max attendees -->
        <div>
          <label class="block font-semibold mb-1">Max. deelnemers</label>
          <input v-model.number="localMaxAttendees" type="number" class="w-full border rounded px-2 py-1" />
        </div>

        <!-- Sessions -->
        <div>
          <label class="block font-semibold mb-2">Sessions</label>
          <div v-for="(session, idx) in localSessions" :key="session.id" class="border rounded p-2 mb-2">
            <div class="flex gap-2 mb-1">
              <input v-model="session.title" placeholder="Titel" class="flex-1 border rounded px-2 py-1" />
              <select v-model="session.type" class="border rounded px-2 py-1">
                <option value="lecture">Lecture</option>
                <option value="break">Break</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
            <div class="flex gap-2 mb-1">
              <input v-model="session.start" type="datetime-local" class="border rounded px-2 py-1 flex-1" />
              <input v-model="session.end" type="datetime-local" class="border rounded px-2 py-1 flex-1" />
            </div>
            <div class="flex gap-2 mb-1">
              <input v-model="session.location" placeholder="Locatie" class="flex-1 border rounded px-2 py-1" />
              <select v-model="session.speakerId" class="border rounded px-2 py-1 flex-1">
                <option value="">Selecteer spreker</option>
                <option v-for="spk in speakers" :key="spk.id" :value="spk.id">{{ spk.name }}</option>
              </select>
            </div>
            <button @click="removeSession(idx)" class="text-red-500 text-sm mt-1">Verwijder Session</button>
          </div>
          <button @click="addSession" class="mt-1 bg-[#FF8A3D] text-white px-3 py-1 rounded">+ Add Session</button>
        </div>

        <!-- Tickets -->
        <div>
          <label class="block font-semibold mb-2">Tickets</label>
          <div v-for="(ticket, idx) in localTickets" :key="ticket.id" class="flex gap-2 mb-2">
            <input v-model="ticket.name" placeholder="Naam" class="flex-1 border rounded px-2 py-1" />
            <input v-model.number="ticket.price" type="number" placeholder="Prijs" class="border rounded px-2 py-1 w-24" />
            <input v-model.number="ticket.amount" type="number" placeholder="Aantal" class="border rounded px-2 py-1 w-24" />
            <button @click="removeTicket(idx)" class="text-red-500 text-sm">x</button>
          </div>
          <button @click="addTicket" class="mt-1 bg-[#FF8A3D] text-white px-3 py-1 rounded">+ Add Ticket</button>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="$emit('close')" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="saveEvent" class="px-4 py-2 bg-[#FF8A3D] text-white rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>