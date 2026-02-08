<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useEventStore } from '../stores/event'
import { useUserStore } from '../stores/user'

import type { Event } from '../stores/event'

import EventCard from './EventCard.vue'
import AddEventCard from './AddEventCard.vue'
import EventShowModal from './EventShowModal.vue'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isCurrentUserAdmin)

const eventStore = useEventStore()
const { events } = storeToRefs(eventStore)

const modalRef = ref<InstanceType<typeof EventShowModal> | null>(null)

onMounted(() => {
	if (!events.value.length) {
		eventStore.seedMockEvents?.()
	}
})

const openEvent = (event: Event) => {
	modalRef.value?.openEvent(event)
}

const addEvent = () => {
	modalRef.value?.openNewEvent()
}

const editEvent = (event: Event) => {
	modalRef.value?.openEvent(event)
}

const deleteEvent = (id: string) => {
	if (!confirm('Weet je zeker dat je dit event wilt verwijderen?')) return
	eventStore.deleteEvent(id)
}
</script>

<template>
	<section class="bg-[#FBF6EE] dark:bg-[#1F1D2B] py-16">
		<div class="max-w-6xl mx-auto px-4">
			<h2 class="text-4xl font-bold mb-10 text-center">
				Events
			</h2>

			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
				<EventCard
					v-for="event in events"
					:key="event.id"
					:event="event"
					@open="openEvent"
					@edit="editEvent"
					@delete="deleteEvent"
				/>

				<AddEventCard
					v-if="!isAdmin"
					@click="addEvent"
				/>
			</div>
		</div>

		<EventShowModal ref="modalRef" />
	</section>
</template>
