import { defineStore } from 'pinia';

export interface Speaker {
    id: string;
    name: string;
    bio: string;
    image: string;
}

export const useSpeakerStore = defineStore('speaker', {
    state: () => ({
        speakers: [] as Speaker[]
    }),

    getters: {
        getSpeakerById: (state) => (id: string) => {
            return state.speakers.find(speaker => speaker.id === id);
        },

        getAllSpeakers: (state) => state.speakers
    },

    actions: {
        addSpeaker(speaker: Speaker) {
            this.speakers.push(speaker);
        },

        updateSpeaker(id: string, updatedSpeaker: Partial<Speaker>) {
            const index = this.speakers.findIndex(s => s.id === id);
            if (index !== -1) {
                this.speakers[index] = { ...this.speakers[index], ...updatedSpeaker } as Speaker;
            }
        },

        deleteSpeaker(id: string) {
            this.speakers = this.speakers.filter(s => s.id !== id);
        }
    }
});