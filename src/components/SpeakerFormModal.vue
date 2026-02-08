<script setup lang="ts">
import { reactive } from 'vue'
import { useSpeakerStore, type Speaker } from '../stores/speaker.ts'
import { nanoid } from 'nanoid'

type SocialPlatform =
	| 'facebook'
	| 'linkedin'
	| 'instagram'
	| 'x'
	| 'youtube'
	| 'website'
	| 'whatsapp'

const props = defineProps<{ speaker: Speaker | null }>()
const emit = defineEmits(['close'])

const speakerStore = useSpeakerStore()

const socialPlatforms: SocialPlatform[] = [
	'facebook',
	'linkedin',
	'instagram',
	'x',
	'youtube',
	'website',
	'whatsapp'
]

const form = reactive({
	id: props.speaker?.id ?? nanoid(),
	name: props.speaker?.name ?? '',
	bio: props.speaker?.bio ?? '',
	image: props.speaker?.image ?? '',
	socials: { ...(props.speaker?.socials ?? {}) } as Record<SocialPlatform, boolean>
})

type Gender = 'men' | 'women'

const setRandomImage = (gender: Gender) => {
	const randomIndex = Math.floor(Math.random() * 100)
	form.image = `https://randomuser.me/api/portraits/${gender}/${randomIndex}.jpg`
}

const save = () => {
	if (props.speaker) {
		speakerStore.updateSpeaker(form.id, form)
	} else {
		speakerStore.addSpeaker(form)
	}
	emit('close')
}

const inputClass =
	'w-full rounded-xl px-4 py-2 text-sm transition ' +
	'bg-[#F9F7F3] text-[#1F1D2B] placeholder-black/40 ' +
	'border border-black/10 ' +
	'focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]/50 focus:border-[#FF8A3D] ' +
	'dark:bg-[#1A1726] dark:text-[#F3ECDD] dark:placeholder-white/40 dark:border-white/10'

</script>

<template>
	<div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
		<div class="w-full max-w-4xl rounded-2xl p-6
			bg-white dark:bg-[#2A263A] shadow-xl">

			<h3 class="text-xl font-bold mb-6 text-center">
				{{ speaker ? 'Spreker bewerken' : 'Nieuwe spreker' }}
			</h3>

            <h4 class="font-semibold mb-3">Spreker gegevens</h4>

            <label class="text-sm">Naam spreker</label>
			<input
				v-model="form.name"
				placeholder="Naam"
				:class="inputClass + ' my-2'"
			/>

            <label class="text-sm">Afbeelding spreker</label>

			<div class="flex gap-3 my-3">
				<button
					type="button"
					@click="setRandomImage('men')"
					class="flex-1 px-4 py-2 rounded-lg text-sm font-medium
					bg-black/5 hover:bg-black/10
					dark:bg-white/10 dark:hover:bg-white/20"
				>
					Random man
				</button>

				<button
					type="button"
					@click="setRandomImage('women')"
					class="flex-1 px-4 py-2 rounded-lg text-sm font-medium
					bg-black/5 hover:bg-black/10
					dark:bg-white/10 dark:hover:bg-white/20"
				>
					Random vrouw
				</button>
			</div>

			<img
				v-if="form.image"
				:src="form.image"
				class="mt-4 mx-auto w-32 h-32 rounded-full
				object-cover border-4 border-[#FF8A3D]"
			/>

            <label class="text-sm">Bio spreker</label>
			<textarea
				v-model="form.bio"
				rows="5"
				placeholder="Bio"
				:class="inputClass + ' my-2'"
			></textarea>

            <div class="mt-6 w-full">
                <h4 class="font-semibold mb-3">Socials</h4>

                <div class="grid grid-cols-2 gap-3">
                    <label
                        v-for="platform in socialPlatforms"
                        :key="platform"
                        class="flex items-center gap-2 cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            v-model="form.socials[platform]"
                            class="accent-[#FF8A3D]"
                        />
                        <span class="capitalize">
                            {{ platform }}
                        </span>
                    </label>
                </div>
            </div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					@click="emit('close')"
					class="px-4 py-2 rounded-lg
					text-sm font-medium
					bg-black/5 hover:bg-black/10
					dark:bg-white/10 dark:hover:bg-white/20"
				>
					Annuleren
				</button>

				<button
					@click="save"
					class="px-5 py-2 rounded-lg
					bg-[#FF8A3D] hover:bg-[#E6752F]
					text-white text-sm font-semibold transition"
				>
					Opslaan
				</button>
			</div>
		</div>
	</div>
</template>
