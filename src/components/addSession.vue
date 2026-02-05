<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventStore, type Session } from '../stores/event'

const props = defineProps<{
  eventId: string
}>()

const eventStore = useEventStore()

const event = computed(() => eventStore.getEventById(props.eventId))

if (!event.value) {
  throw new Error('Event niet gevonden')
}

const form = ref<Session>({
  id: crypto.randomUUID(),
  start: new Date(),
  end: new Date(),
  speakerId: '',
  type: 'lecture',
  location: '',
  title: '',
  description: ''
})

const error = ref('')

function isEndAfterStart() {
  return new Date(form.value.end) > new Date(form.value.start)
}

function hasOverlap() {
  if (!event.value) return false

  return event.value.sessions.some(session => {
    return (
      session.location === form.value.location &&
      new Date(form.value.start) < new Date(session.end) &&
      new Date(form.value.end) > new Date(session.start)
    )
  })
}

function addSession() {
  error.value = ''

  if (!isEndAfterStart()) {
    error.value = 'Eindtijd moet later zijn dan starttijd'
    return
  }

  if (hasOverlap()) {
    error.value = 'Deze locatie is al bezet in dit tijdvak'
    return
  }

  event.value!.sessions.push(form.value)

  eventStore.updateEvent(event.value!.id, {
    sessions: event.value!.sessions
  })

  // form resetten
  form.value = {
    id: crypto.randomUUID(),
    start: new Date(),
    end: new Date(),
    speakerId: '',
    type: 'lecture',
    location: '',
    title: '',
    description: ''
  }
}
</script>

<template>
  <form @submit.prevent="addSession">
    <h3>Sessie toevoegen</h3>

    <p v-if="error" style="color:red">{{ error }}</p>

    <div>
      <label>Titel</label>
      <input v-model="form.title" required />
    </div>

    <div>
      <label>Omschrijving</label>
      <textarea v-model="form.description" required />
    </div>

    <div>
      <label>Type</label>
      <select v-model="form.type">
        <option value="lecture">Lezing</option>
        <option value="break">Pauze</option>
        <option value="drinks">Borrel</option>
      </select>
    </div>

    <div>
      <label>Locatie</label>
      <input v-model="form.location" required />
    </div>

    <div>
      <label>Spreker ID</label>
      <input v-model="form.speakerId" />
    </div>

    <div>
      <label>Starttijd</label>
      <input type="datetime-local" v-model="form.start" />
    </div>

    <div>
      <label>Eindtijd</label>
      <input type="datetime-local" v-model="form.end" />
    </div>

    <button type="submit">Toevoegen</button>
  </form>
</template>