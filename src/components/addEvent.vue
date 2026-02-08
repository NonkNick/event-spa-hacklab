<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore, type Event } from '../stores/event.ts'

const eventStore = useEventStore()

const form = ref<Event>({
  id: crypto.randomUUID(), // uniek id
  name: '',
  maxAttendees: 0,
  sessions: []
})

function submitForm() {
  eventStore.addEvent(form.value)

  // formulier resetten
  form.value = {
    id: crypto.randomUUID(),
    name: '',
    maxAttendees: 0,
    sessions: []
  }

  alert('Event toegevoegd!')
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <h2>Nieuw event toevoegen</h2>

    <div>
      <label>Naam van event</label>
      <input v-model="form.name" required />
    </div>

    <div>
      <label>Maximaal aantal bezoekers</label>
      <input type="number" v-model.number="form.maxAttendees" required />
    </div>

    <button type="submit">Event opslaan</button>
  </form>
</template>