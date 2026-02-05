<template>
  <div class="relative h-full border-l border-gray-300">
    <!-- hour lines -->
    <div v-for="i in hourCount" :key="i" class="absolute left-0 right-0 border-t border-gray-200 text-xs text-gray-400"
      :style="{ top: hourIndexToY(i - 1) + 'px' }">
      {{ formatTime(hourIndexToTime(i - 1)) }}
    </div>

    <!-- sessions -->
    <div v-for="item in layout" :key="item.session.id"
      class="absolute left-4 right-4 bg-orange-400 text-white rounded p-2 text-sm" :style="{
        top: item.topPx + 'px',
        height: item.heightPx + 'px'
      }">
      <div class="font-bold">{{ item.session.title }}</div>
      <div class="text-xs opacity-90">
        {{ formatTime(item.session.start) }} – {{ formatTime(item.session.end) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Event, Session } from '../stores/event'
import { useEventTimelineLayout } from '../composables/useEventTimelineLayout'

const props = defineProps<{
  event: Event
}>()

/**
 * Normaliseert Date | string → Date
 * Nodig i.v.m. Pinia persisted state
 */
function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatTime(value: Date | string): string {
  return toDate(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const {
  timelineStartAt,
  hourCount,
  hourIndexToY,
  hourIndexToTime,
  sessionToLayout
} = useEventTimelineLayout(computed(() => props.event))

const layout = computed(() =>
  props.event.sessions.map((session: Session) => ({
    session,
    ...sessionToLayout(session)
  }))
)
</script>
