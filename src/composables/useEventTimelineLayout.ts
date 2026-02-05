import { computed, type Ref } from "vue";
import type { Event, Session } from "../stores/event";

function toDate(value: Date | string): Date {
	return value instanceof Date ? value : new Date(value);
}

export function useEventTimelineLayout(event: Ref<Event>, pixelsPerHour = 80) {
	const timelineStartAt = computed(() => {
		if (!event.value.sessions.length) return new Date();

		const startTimes = event.value.sessions.map((s) =>
			toDate(s.start).getTime(),
		);

		const earliest = new Date(Math.min(...startTimes));
		earliest.setMinutes(0, 0, 0);
		return earliest;
	});

	const timelineEndAt = computed(() => {
		if (!event.value.sessions.length) {
			return new Date(Date.now() + 60 * 60 * 1000);
		}

		const endTimes = event.value.sessions.map((s) =>
			toDate(s.end).getTime(),
		);

		const latest = new Date(Math.max(...endTimes));

		if (latest.getMinutes() > 0 || latest.getSeconds() > 0) {
			latest.setHours(latest.getHours() + 1);
		}

		latest.setMinutes(0, 0, 0);
		return latest;
	});

	const timelineDurationHours = computed(() => {
		if (!event.value.sessions.length) return 1;

		const startTimes = event.value.sessions.map((s) =>
			toDate(s.start).getTime(),
		);
		const endTimes = event.value.sessions.map((s) =>
			toDate(s.end).getTime(),
		);

		const earliest = new Date(Math.min(...startTimes));
		earliest.setMinutes(0, 0, 0);

		const latest = new Date(Math.max(...endTimes));
		if (latest.getMinutes() > 0 || latest.getSeconds() > 0) {
			latest.setHours(latest.getHours() + 1);
		}
		latest.setMinutes(0, 0, 0);

		return (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60);
	});

	const timelineHeightPx = computed(
		() => timelineDurationHours.value * pixelsPerHour,
	);

	const hourCount = computed(() => Math.ceil(timelineDurationHours.value));

	const hourIndexToY = (hourIndex: number) => hourIndex * pixelsPerHour;

	const hourIndexToTime = (hourIndex: number) => {
		const date = new Date(timelineStartAt.value);
		date.setHours(date.getHours() + hourIndex);
		return date;
	};

	const sessionToLayout = (session: Session) => {
		const start = toDate(session.start);
		const end = toDate(session.end);

		const minutesFromStart =
			(start.getTime() - timelineStartAt.value.getTime()) / 60000;

		const durationMinutes = (end.getTime() - start.getTime()) / 60000;

		const topPx = Math.max(0, (minutesFromStart / 60) * pixelsPerHour);

		const heightPx = Math.max(0, (durationMinutes / 60) * pixelsPerHour);

		return { topPx, heightPx };
	};

	return {
		timelineStartAt,
		timelineEndAt,
		timelineDurationHours,
		timelineHeightPx,
		hourCount,
		hourIndexToY,
		hourIndexToTime,
		sessionToLayout,
	};
}
