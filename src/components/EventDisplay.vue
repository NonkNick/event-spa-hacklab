<template>
  <div class="relative w-full rounded-xl" :style="{ height: timelineHeightPx + 'px' }">
    <!-- hour lines -->
    <div v-for="i in hourCount" :key="i"
         class="absolute left-0 right-0 border-t border-[#3F3A56]/10 dark:border-[#F3ECDD]/10 flex items-start"
         :style="{ top: hourIndexToY(i - 1) + 'px' }">
      <span class="text-[10px] font-bold text-[#6B647A] dark:text-[#D6CCE5] -mt-2.5 ml-1 bg-white dark:bg-[#2A263A] px-1.5 py-0.5 rounded-md z-10 shadow-sm border border-[#3F3A56]/5 dark:border-[#F3ECDD]/5">
        {{ formatTime(hourIndexToTime(i - 1)) }}
      </span>
    </div>

    <!-- Vertical Timeline Line -->
    <div class="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-[#3F3A56]/5 via-[#3F3A56]/20 to-[#3F3A56]/5 dark:from-[#F3ECDD]/5 dark:via-[#F3ECDD]/20 dark:to-[#F3ECDD]/5"></div>

    <!-- sessions -->
    <div v-for="item in layout" :key="item.session.id"
         class="absolute left-16 right-3 rounded-lg p-3 text-sm flex flex-col overflow-hidden cursor-default transition-all hover:scale-[1.02] hover:shadow-lg z-20 group"
         :class="getTypeStyles(item.session.type)"
         :style="{ top: item.topPx + 'px', height: item.heightPx + 'px' }">
      <div class="font-bold truncate text-sm mb-1 group-hover:whitespace-normal" :title="item.session.title">
        {{ item.session.title }}
      </div>
      <div class="text-[10px] opacity-90 flex items-center gap-1 font-medium">
        <ClockIcon class="w-3.5 h-3.5" />
        {{ formatTime(item.session.start) }} – {{ formatTime(item.session.end) }}
      </div>
      <div v-if="item.heightPx > 70" class="text-[10px] mt-2 opacity-80 italic truncate border-t border-current/20 pt-2 flex items-center gap-1">
        <MapPinIcon class="w-3 h-3" />
        {{ item.session.location }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ClockIcon, MapPinIcon } from '@heroicons/vue/20/solid'
import type { Event, Session, SessionType } from '../stores/event'
import { useEventTimelineLayout } from '../composables/useEventTimelineLayout'

const props = defineProps<{ event: Event }>()

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatTime(value: Date | string): string {
  return toDate(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeStyles(type: SessionType): string {
  const styles: Record<SessionType, string> = {
    lecture: 'bg-[#FF8A3D] text-white shadow-[#FF8A3D]/20',
    break: 'bg-[#e7d6bc] dark:bg-[#3A344C] text-[#3F3A56] dark:text-[#F3ECDD] shadow-black/5',
    drinks: 'bg-[#3F3A56] dark:bg-[#2C2740] text-white shadow-black/10'
  }
  return styles[type] || 'bg-[#FF8A3D] text-white'
}

const { hourCount, hourIndexToY, hourIndexToTime, sessionToLayout, timelineHeightPx } =
    useEventTimelineLayout(computed(() => props.event))

const layout = computed(() =>
    props.event.sessions.map((session: Session) => ({
      session,
      ...sessionToLayout(session)
    }))
)
</script>
