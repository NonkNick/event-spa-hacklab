<template>
  <!-- hour lines -->
  <div v-for="i in hourCount" :key="i"
       class="absolute left-0 right-0 border-t border-gray-200 text-xs text-gray-400"
       :style="{ top: hourIndexToY(i - 1) + 'px' }">
    {{ formatTime(hourIndexToTime(i - 1)) }}
  </div>

  <!-- sessions -->
  <div v-for="item in layout" :key="item.session.id"
       class="absolute left-4 right-4 bg-orange-400 text-white rounded p-2 text-sm"
       :style="{ top: item.topPx + 'px', height: item.heightPx + 'px' }">
    <div class="font-bold">{{ item.session.title }}</div>
    <div class="text-xs opacity-90">
      {{ formatTime(item.session.start) }} – {{ formatTime(item.session.end) }}
    </div>
  </div>

  <!--    <div-->
  <!--        v-for="index in hourCount"-->
  <!--        :key="index"-->
  <!--        :style="{ top: hourIndexToY(index) + 'px' }"-->
  <!--        class="absolute left-0 w-full border-t border-orange-200-->
  <!--         dark:border-orange-500 text-xs text-orange-500-->
  <!--         pointer-events-none z-0"-->
  <!--    >-->
  <!--        <span-->
  <!--            class="absolute -top-2 left-3 bg-orange-100 px-1-->
  <!--         dark:bg-[#3A344C]-->
  <!--         pointer-events-none z-0"-->
  <!--        >-->
  <!--          {{-->
  <!--            hourIndexToTime(index).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})-->
  <!--          }}-->
  <!--        </span>-->
  <!--    </div>-->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Event, Session } from '../stores/event'
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

const { hourCount, hourIndexToY, hourIndexToTime, sessionToLayout } =
    useEventTimelineLayout(computed(() => props.event))

const layout = computed(() =>
    props.event.sessions.map((session: Session) => ({
      session,
      ...sessionToLayout(session)
    }))
)
</script>
