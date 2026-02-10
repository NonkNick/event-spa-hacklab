<script setup lang="ts">
import { computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { type TicketType, useEventStore } from '../stores/event'
import { useTicketStore } from '../stores/ticket'

const props = defineProps<{
  eventId: string
  ticketTypes: TicketType[]
}>()

const emit = defineEmits<{
  (e: 'select', ticketType: TicketType): void
  (e: 'close'): void
}>()

const ticketStore = useTicketStore()
const eventStore = useEventStore()

const remainingStock = computed(() => {
  const event = eventStore.getEventById(props.eventId)
  if (!event) return 0
  const soldTickets = ticketStore.getTicketsByEventId(props.eventId).length
  return Math.max(0, event.maxAttendees - soldTickets)
})
</script>

<template>
  <div class="absolute right-0 bottom-full mb-2 w-64 bg-white dark:bg-[#2A263A] border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20 rounded-lg shadow-xl z-50 overflow-hidden">
    <div class="p-3 border-b border-[#3F3A56]/10 dark:border-[#F3ECDD]/10 flex justify-between items-center">
      <div class="flex flex-col">
        <span class="font-bold text-sm text-[#3F3A56] dark:text-[#F3ECDD]">Kies een tickettype</span>
        <span class="text-[10px] text-[#6B647A] dark:text-[#D6CCE5] uppercase tracking-wider">
          {{ remainingStock }} plekken over
        </span>
      </div>
      <button @click="emit('close')" class="text-[#3F3A56] dark:text-[#F3ECDD] hover:text-[#FF8A3D]">
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>
    <div class="max-h-60 overflow-y-auto">
      <button
        v-for="type in ticketTypes"
        :key="type.name"
        @click="remainingStock > 0 && emit('select', type)"
        :disabled="remainingStock <= 0"
        class="w-full text-left p-3 hover:bg-[#FF8A3D]/10 transition-colors border-b last:border-0 border-[#3F3A56]/5 dark:border-[#F3ECDD]/5 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold text-[#3F3A56] dark:text-[#F3ECDD] group-hover:text-[#FF8A3D]">{{ type.name }}</span>
          <span class="font-bold text-[#FF8A3D]">€{{ type.price }}</span>
        </div>
        <p v-if="type.description" class="text-xs text-[#6B647A] dark:text-[#D6CCE5]">{{ type.description }}</p>
      </button>
    </div>
  </div>
</template>
