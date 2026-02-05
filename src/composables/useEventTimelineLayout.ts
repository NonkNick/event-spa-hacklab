import { computed, type Ref } from 'vue'
import type { Event, Session } from '../stores/event'

export function useEventTimelineLayout(
  event: Ref<Event>, // Ref nu
  pixelsPerHour = 80
) {
  const timelineStartAt = computed(() => {
    if (!event.value.sessions.length) return new Date()
    const starts = event.value.sessions.map(s => s.start.getTime())
    const earliest = new Date(Math.min(...starts))
    earliest.setMinutes(0, 0, 0)
    return earliest
  })

  const timelineEndAt = computed(() => {
    if (!event.value.sessions.length)
      return new Date(new Date().getTime() + 60 * 60 * 1000)
    const ends = event.value.sessions.map(s => s.end.getTime())
    const latest = new Date(Math.max(...ends))
    latest.setMinutes(0, 0, 0)
    return latest
  })

  const timelineDurationHours = computed(() => {
    if (!event.value.sessions.length) return 1
    const starts = event.value.sessions.map(s => s.start.getTime())
    const ends = event.value.sessions.map(s => s.end.getTime())
    const earliest = new Date(Math.min(...starts))
    earliest.setMinutes(0, 0, 0)
    const latest = new Date(Math.max(...ends))
    latest.setHours(latest.getHours() + (latest.getMinutes() > 0 ? 1 : 0))
    latest.setMinutes(0, 0, 0)
    return (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60)
  })
  // rest blijft hetzelfde


  const timelineHeightPx = computed(() => timelineDurationHours.value * pixelsPerHour)

  const hourCount = computed(() => Math.ceil(timelineDurationHours.value))

  const hourIndexToY = (hourIndex: number) => hourIndex * pixelsPerHour

  const hourIndexToTime = (hourIndex: number) => {
    const date = new Date(timelineStartAt.value)
    date.setHours(date.getHours() + hourIndex)
    return date
  }

  const sessionToLayout = (session: Session) => {
    const minutesFromStart = (session.start.getTime() - timelineStartAt.value.getTime()) / 60000
    const durationMinutes = (session.end.getTime() - session.start.getTime()) / 60000

    const topPx = Math.max(0, (minutesFromStart / 60) * pixelsPerHour)
    const heightPx = Math.max(0, (durationMinutes / 60) * pixelsPerHour)
    return { topPx, heightPx }
  }

  return {
    timelineStartAt,
    timelineEndAt,
    timelineDurationHours,
    timelineHeightPx,
    hourCount,
    hourIndexToY,
    hourIndexToTime,
    sessionToLayout
  }
}
