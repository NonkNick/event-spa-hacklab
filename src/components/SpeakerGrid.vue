<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useSpeakerStore } from '../stores/speaker'
import { useUserStore } from '../stores/user'

import type { Speaker } from '../stores/speaker'

import SpeakerCard from './SpeakerCard.vue'
import AddSpeakerCard from './AddSpeakerCard.vue'
import SpeakerFormModal from './SpeakerFormModal.vue'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isCurrentUserAdmin)

const speakerStore = useSpeakerStore()
const { speakers } = storeToRefs(speakerStore)

const showModal = ref(false)
const editingSpeaker = ref<Speaker | null>(null)

onMounted(() => {
	speakerStore.seedMockSpeakers()
})

const addSpeaker = () => {
	editingSpeaker.value = null
	showModal.value = true
}

const editSpeaker = (speaker: Speaker) => {
	editingSpeaker.value = speaker
	showModal.value = true
}

const deleteSpeaker = (id: string) => {
	if (!confirm('Weet je zeker dat je deze spreker wilt verwijderen?')) return
	speakerStore.deleteSpeaker(id)
}
</script>


<template>
	<section class="bg-[#FBF6EE] dark:bg-[#1F1D2B] py-16">
		<div class="max-w-6xl mx-auto px-4">
			<h2 class="text-4xl font-bold mb-10 text-center">
				Sprekers
			</h2>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

				<SpeakerCard
					v-for="speaker in speakers"
					:key="speaker.id"
					:speaker="speaker"
					@edit="editSpeaker"
					@delete="deleteSpeaker"
				/>

				<AddSpeakerCard v-if="isAdmin" @click="addSpeaker" class="cursor-pointer " />
			</div>
		</div>

		<SpeakerFormModal
			v-if="showModal"
			:speaker="editingSpeaker"
			@close="showModal = false"
		/>
	</section>
</template>
