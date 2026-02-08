<script setup lang="ts">
import type { Event } from '../stores/event'
import { useSpeakerStore } from '../stores/speaker'
defineProps<{ event: Event }>()
const speakerStore = useSpeakerStore()
</script>

<template>
  <div class="bg-white dark:bg-[#2A263A]
              border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
              rounded-xl shadow-md
              transition-colors
              flex flex-col w-full max-w-xs">
    <div class="p-6 flex flex-col h-full text-left">
      <h3 class="text-2xl font-bold mb-2">{{ event.name }}</h3>
      <p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
        Max bezoekers: {{ event.maxAttendees }}
      </p>
      <ul class="text-sm space-y-1 mb-4">
        <li v-for="s in event.sessions" :key="s.id">
          {{ s.title }} — {{ new Date(s.start).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }}
          - {{ new Date(s.end).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }}
          ({{ s.location }})
          <span v-if="s.speakerId">
    — {{ speakerStore.speakers.find(sp => sp.id === s.speakerId)?.name }}
  </span>
        </li>
      </ul>
      <button class="mt-auto bg-[#FF8A3D] text-white px-3 py-2 rounded">
        Beheer
      </button>
    </div>
  </div>
</template>