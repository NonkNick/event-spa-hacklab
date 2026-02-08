import { defineStore } from "pinia";

export type SocialPlatform =
	| "facebook"
	| "linkedin"
	| "instagram"
	| "x"
	| "youtube"
	| "website"
	| "whatsapp";

export interface Speaker {
	id: string;
	name: string;
	bio: string;
	image: string;
	socials?: Partial<Record<SocialPlatform, boolean>>;
}

export const useSpeakerStore = defineStore("speaker", {
	state: () => ({
		speakers: [] as Speaker[],
	}),
	persist: true,

	getters: {
		getSpeakerById: (state) => (id: string) => {
			return state.speakers.find((speaker) => speaker.id === id);
		},

		getAllSpeakers: (state) => state.speakers,
	},

	actions: {
		addSpeaker(speaker: Speaker) {
			this.speakers.push(speaker);
		},

		seedMockSpeakers() {
			if (this.speakers.length) return;

			this.speakers = [
				{
					id: "1",
					name: "Sarah van Dijk",
					bio: "UI/UX designer met focus op toegankelijkheid en design systems.",
					image: "https://randomuser.me/api/portraits/women/44.jpg",
					socials: {
						linkedin: true,
						instagram: true,
						x: true,
						whatsapp: true,
					},
				},
				{
					id: "2",
					name: "Mark Jansen",
					bio: "Frontend engineer gespecialiseerd in Vue en performance.",
					image: "https://randomuser.me/api/portraits/men/32.jpg",
					socials: {
						linkedin: true,
						instagram: true,
						x: true,
						website: true,
					},
				},
			];
		},

		updateSpeaker(id: string, updatedSpeaker: Partial<Speaker>) {
			const index = this.speakers.findIndex((s) => s.id === id);
			if (index !== -1) {
				this.speakers[index] = {
					...this.speakers[index],
					...updatedSpeaker,
				} as Speaker;
			}
		},

		deleteSpeaker(id: string) {
			this.speakers = this.speakers.filter((s) => s.id !== id);
		},
	},
});
