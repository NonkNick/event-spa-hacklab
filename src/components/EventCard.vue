<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '../stores/event'
import { useUserStore } from '../stores/user'
import { useSpeakerStore } from '../stores/speaker'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isCurrentUserAdmin)

const speakerStore = useSpeakerStore()

const speakerName = computed(() => {
	if (!firstSession.value?.speakerId) return '—'

	return (
		speakerStore.getSpeakerById(firstSession.value.speakerId)?.name ??
		'—'
	)
})

const props = defineProps<{
	event: Event
}>()

const emit = defineEmits<{
	(e: 'open', event: Event): void
	(e: 'edit', event: Event): void
	(e: 'delete', id: string): void
}>()

const firstSession = computed(() => {
  const session = props.event.sessions[0] ?? null
  if (!session) return null

  return {
    ...session,
    start: new Date(session.start),
    end: new Date(session.end)
  }
})

</script>

<template>
	<div
		class="relative overflow-hidden
		bg-white dark:bg-[#2A263A]
		border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
		rounded-lg shadow-md
		transition-colors
		flex flex-col h-full"
	>

		<div
			v-if="!isAdmin"
			class="absolute top-3 left-3 z-30 flex gap-2"
			@click.stop
		>
			<button
				@click="emit('edit', event)"
				class="bg-white/90 px-1 py-1 rounded shadow hover:text-[#FF8A3D] cursor-pointer"
				title="Bewerken"
			>
				✏️
			</button>

			<button
				@click="emit('delete', event.id)"
				class="bg-white/90 px-1 py-1 rounded shadow hover:text-[#FF8A3D] cursor-pointer"
				title="Verwijderen"
			>
				🗑️
			</button>
		</div>

		<div class="relative">
			<img
				:src="event.image ?? 'https://images.unsplash.com/photo-1625838144804-300f3907c110'"
				class="h-55 w-full object-cover"
			/>

			<div
				class="absolute inset-0
				bg-gradient-to-t
				from-black/70 via-black/30 to-transparent"
			></div>

			<div class="absolute bottom-4 left-4 right-4 text-left">
				<h3 class="text-2xl font-bold text-white leading-tight">
					{{ event.name }}
				</h3>

				<p class="text-base text-white/80">
					{{ speakerName }}
				</p>
			</div>

			<div
				v-if="firstSession"
				class="absolute top-4 right-4
				text-base font-semibold
				bg-[#FF8A3D] text-white
				px-3 py-1 rounded-full shadow"
			>
				{{ firstSession.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
				–
				{{ firstSession.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
			</div>
		</div>

		<div class="p-6 text-left flex flex-col h-full">
			<p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
				{{ event.description ?? 'Geen beschrijving beschikbaar.' }}
			</p>

			<div class="mt-auto">
				<ul class="text-base space-y-1">
					<li>
						<span class="font-bold">Locatie:</span>
						{{ firstSession?.location ?? '—' }}
					</li>
					<li>
						<span class="font-bold">Datum:</span>
						{{ firstSession?.start.toLocaleDateString() ?? '—' }}
					</li>
					<li>
						<span class="font-bold">Tijd:</span>
						{{ firstSession
							? `${firstSession.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${firstSession.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
							: '—'
						}}
					</li>
				</ul>

				<button
					class="mt-6 w-full
					bg-[#FF8A3D] hover:bg-[#E6752F]
					text-white font-semibold
					py-2 rounded-md
					transition-colors cursor-pointer"
				>
					Tickets
				</button>
			</div>
		</div>
	</div>
</template>
