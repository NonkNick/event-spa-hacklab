<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventStore, type Session } from '../stores/event.ts'

const props = defineProps<{
  eventId: string
  sessionId: string
}>()

const eventStore = useEventStore()

const event = computed(() => eventStore.getEventById(props.eventId))

if (!event.value) {
  throw new Error('Event niet gevonden')
}

const originalSession = event.value.sessions.find(
  s => s.id === props.sessionId
)

if (!originalSession) {
  throw new Error('Session niet gevonden')
}

// kopie maken zodat we niet direct het origineel aanpassen
const form = ref<Session>({ ...originalSession })

const error = ref('')

function isEndAfterStart() {
  return new Date(form.value.end) > new Date(form.value.start)
}

function hasOverlap() {
  if (!event.value) return false

  return event.value.sessions.some(session => {
    if (session.id === form.value.id) return false // zichzelf overslaan

    return (
      session.location === form.value.location &&
      new Date(form.value.start) < new Date(session.end) &&
      new Date(form.value.end) > new Date(session.start)
    )
  })
}

function saveSession() {
  error.value = ''

  if (!isEndAfterStart()) {
    error.value = 'Eindtijd moet later zijn dan starttijd'
    return
  }

  if (hasOverlap()) {
    error.value = 'Deze locatie is al bezet in dit tijdvak'
    return
  }

  const index = event.value!.sessions.findIndex(
    s => s.id === form.value.id
  )

  event.value!.sessions[index] = form.value

  eventStore.updateEvent(event.value!.id, {
    sessions: event.value!.sessions
  })

  alert('Session bijgewerkt!')
}
</script>

<template>
  <form @submit.prevent="saveSession">
    <h3>Sessie bewerken</h3>

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

    <button type="submit">Opslaan</button>
  </form>
</template>