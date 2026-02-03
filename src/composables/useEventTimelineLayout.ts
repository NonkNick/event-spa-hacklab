import { computed } from 'vue'
import type { Event, Session } from '../stores/event'

export function useEventTimelineLayout(
    event: Event,
    pixelsPerHour = 80
) {

    const timelineStartAt = computed(() => {
        const starts = event.sessions.map(s => s.start.getTime())
        const earliest = new Date(Math.min(...starts))
        earliest.setMinutes(0, 0, 0) // round down to the hour
        return earliest
    })

    const timelineEndAt = computed(() => {
        const ends = event.sessions.map(s => s.end.getTime())
        const latest = new Date(Math.max(...ends))

        if (latest.getTime() % (1000 * 60 * 60) !== 0) {
            latest.setHours(latest.getHours() + 1)
        }
        latest.setMinutes(0, 0, 0)

        return latest
    })

    const timelineDurationHours = computed(() => {
        return (
            (timelineEndAt.value.getTime() - timelineStartAt.value.getTime()) /
            (1000 * 60 * 60)
        )
    })

    const timelineHeightPx = computed(() => {
        return timelineDurationHours.value * pixelsPerHour
    })

    const hourCount = computed(() => Math.ceil(timelineDurationHours.value))

    const hourIndexToY = (hourIndex: number) => hourIndex * pixelsPerHour

    const hourIndexToTime = (hourIndex: number) => {
        const date = new Date(timelineStartAt.value)
        date.setHours(date.getHours() + hourIndex)
        return date
    }

    const sessionToLayout = (session: Session) => {
        const minutesFromStart =
            (session.start.getTime() - timelineStartAt.value.getTime()) / 60000
        const durationMinutes =
            (session.end.getTime() - session.start.getTime()) / 60000

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
