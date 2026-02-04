<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Speaker, SocialPlatform } from '../stores/speaker'

const adminMode = ref(true)
const isAdmin = computed(() => adminMode.value)

const props = defineProps<{
	speaker: Speaker
}>()

const emit = defineEmits<{
	(e: 'edit', speaker: Speaker): void
	(e: 'delete', id: string): void
}>()

const activeSocials = computed<SocialPlatform[]>(() => {
	if (!props.speaker.socials) return []

	return Object.entries(props.speaker.socials)
		.filter(([, enabled]) => enabled)
		.map(([platform]) => platform as SocialPlatform)
})

const hasSocials = computed(() => activeSocials.value.length > 0)

const getIcon = (platform: SocialPlatform) => {
	return new URL(
		`../assets/images/socials/${platform}.png`,
		import.meta.url
	).href
}
</script>

<template>
	<div
		class="relative bg-white dark:bg-[#2A263A]
		border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
		rounded-xl shadow-md
		p-8 text-center
		flex flex-col items-center
		transition-colors"
	>
		<div v-if="isAdmin" class="absolute top-4 right-4 flex gap-2 z-10">
			<button
				@click="emit('edit', speaker)"
				class="hover:text-[#FF8A3D] cursor-pointer"
				title="Bewerken"
			>
				✏️
			</button>

			<button
				@click="emit('delete', speaker.id)"
				class="hover:text-red-500 cursor-pointer"
				title="Verwijderen"
			>
				🗑️
			</button>
		</div>

		<img
			:src="speaker.image"
			:alt="speaker.name"
			class="w-40 h-40 rounded-full object-cover mb-4
			border-4 border-[#FF8A3D]"
		/>

		<h3 class="text-2xl font-bold mb-2">
			{{ speaker.name }}
		</h3>

		<p
			class="text-[#6B647A] dark:text-[#D6CCE5]
			text-base mb-6"
		>
			{{ speaker.bio }}
		</p>

		<div
			v-if="hasSocials"
			class="flex gap-3 mb-6"
		>
			<img
				v-for="platform in activeSocials"
				:key="platform"
				:src="getIcon(platform)"
				class="w-9 h-9 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
			/>
		</div>

		<button
			class="mt-auto
			bg-[#FF8A3D] hover:bg-[#E6752F]
			text-white font-semibold
			px-16 py-2 rounded-md
			transition-colors cursor-pointer"
		>
			{{ speaker.name.split(' ')[0] }}'s evenementen
		</button>
	</div>
</template>
