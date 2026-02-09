<script setup lang="ts">
import { computed } from 'vue'
import { useEventStore } from '../stores/event'
import EventCard from './EventCard.vue'

const eventStore = useEventStore()
const events = computed(() => eventStore.events)

const emit = defineEmits<{
  (e: 'edit', eventId: string): void
  (e: 'add'): void
}>()

function handleEdit(id: string) {
  emit('edit', id)
}

function handleAdd() {
  emit('add')
}
</script>

<template>
  <div class="mb-6 text-center">
    <button
      @click="handleAdd"
      class="bg-[#FF8A3D] text-white font-bold px-6 py-3 rounded-lg mb-6 hover:bg-[#E6752F] transition"
    >
      Nieuw Event Aanmaken
    </button>

    <div class="flex flex-wrap justify-around">
      <EventCard
        v-for="e in events"
        :key="e.id"
        :event="e"
        @edit="handleEdit"
      />
    </div>
  </div>
</template>