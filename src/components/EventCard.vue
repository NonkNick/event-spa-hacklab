<script setup lang="ts">
import type { Event } from '../stores/event'

const props = defineProps<{ event: Event }>()
const emit = defineEmits<{
  (e: 'edit', event: Event): void
  (e: 'delete', eventId: string): void
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-[#2A263A]
           border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
           rounded-xl shadow-md
           p-6 flex flex-col justify-between"
  >
    <div>
      <h3 class="text-2xl font-bold mb-2">{{ props.event.name }}</h3>
      <p class="text-sm mb-2 text-[#6B647A] dark:text-[#D6CCE5]">
        Max bezoekers: {{ props.event.maxAttendees }}
      </p>
      <ul class="text-sm space-y-1">
        <li v-for="s in props.event.sessions" :key="s.id">
          {{ s.title }} — {{ s.location }}
        </li>
      </ul>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <button
        @click="$emit('edit', props.event)"
        class="bg-[#FF8A3D] text-white px-4 py-2 rounded hover:bg-[#E6752F]"
      >
        Bewerk
      </button>
      <button
        @click="$emit('delete', props.event.id)"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Verwijder
      </button>
    </div>
  </div>
</template>