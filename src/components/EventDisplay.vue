<template>
  <div class="w-full h-full bg-orange-100  dark:bg-[#3A344C]
rounded-3xl overflow-y-auto">
    <div
        :style="{ height: timelineHeightPx + 'px' }"
        class="relative w-full my-2"
    >
      <div
          v-for="item in sessionLayouts"
          :key="item.session.id"
          :style="{ top: item.topPx + 'px', height: item.heightPx + 'px' }"
          class="absolute left-16 right-4 bg-orange-400 rounded-xl
          p-3 text-white shadow z-10"
      >
        <div class="font-semibold">{{ item.session.title }}</div>
        <div class="text-xs opacity-80">
          {{ item.session.start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
          –
          {{ item.session.end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }}
        </div>
      </div>

      <div
          v-for="index in hourCount"
          :key="index"
          :style="{ top: hourIndexToY(index) + 'px' }"
          class="absolute left-0 w-full border-t border-orange-200
         dark:border-orange-500 text-xs text-orange-500
         pointer-events-none z-0"
      >
        <span
            class="absolute -top-2 left-3 bg-orange-100 px-1
         dark:bg-[#3A344C]
         pointer-events-none z-0"
        >
          {{
            hourIndexToTime(index).toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Event} from '../stores/event'
import {computed} from 'vue'
import {useEventTimelineLayout} from '../composables/useEventTimelineLayout'

const props = defineProps<{ event: Event }>()

const {
  timelineHeightPx,
  hourCount,
  hourIndexToY,
  hourIndexToTime,
  sessionToLayout
} = useEventTimelineLayout(props.event, 80)

const sessionLayouts = computed(() =>
    props.event.sessions.map(session => {
      const layout = sessionToLayout(session)
      return {
        session,
        topPx: layout.topPx,
        heightPx: layout.heightPx
      }
    })
)
</script>

<style scoped>
</style>
