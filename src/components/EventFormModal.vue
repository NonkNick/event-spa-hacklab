<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Event } from '../stores/event'
import { useEventStore } from '../stores/event'

const props = defineProps<{
  event: Event | null
}>()

const emit = defineEmits(['close'])

const eventStore = useEventStore()

const name = ref('')
const maxAttendees = ref<number>(0)

watch(
  () => props.event,
  (newVal) => {
    if (newVal) {
      name.value = newVal.name
      maxAttendees.value = newVal.maxAttendees
    } else {
      name.value = ''
      maxAttendees.value = 0
    }
  },
  { immediate: true }
)

function save() {
  if (!name.value) return

  if (props.event) {
    // Update event via store
    eventStore.updateEvent(props.event.id, {
      name: name.value,
      maxAttendees: maxAttendees.value
    })
  } else {
    // Add new event
    eventStore.addEvent({
      id: crypto.randomUUID(),
      name: name.value,
      maxAttendees: maxAttendees.value,
      sessions: [],
      tickets: []
    })
  }

  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-[#2A263A] rounded-xl p-6 w-full max-w-md">

      <h2 class="text-2xl font-bold mb-4">
        {{ event ? 'Event bewerken' : 'Nieuw event' }}
      </h2>

      <div class="space-y-3">
        <input
          v-model="name"
          placeholder="Event naam"
          class="w-full border px-3 py-2 rounded"
        />

        <input
          v-model.number="maxAttendees"
          type="number"
          placeholder="Max bezoekers"
          class="w-full border px-3 py-2 rounded"
        />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button @click="$emit('close')" class="px-3 py-1">
          Annuleren
        </button>

        <button
          @click="save"
          class="bg-[#FF8A3D] text-white px-4 py-2 rounded"
        >
          Opslaan
        </button>
      </div>
    </div>
  </div>
</template>