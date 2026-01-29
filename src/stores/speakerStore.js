import { defineStore } from 'pinia'

export const useSpeakerStore = defineStore('speakers', {
  state: () => ({
    speakers: [
      {
        id: 1,
        name: 'Jan Jansen',
        bio: 'Vue developer',
        photoUrl: '',
        presentations: [
          {
            id: 1,
            title: 'Intro to Vue',
            description: 'De basis van Vue 3',
            duration: 45
          }
        ]
      }
    ]
  }),

  actions: {
    addSpeaker(speaker) {
      this.speakers.push({ ...speaker, id: Date.now(), presentations: [] })
    },

    removeSpeaker(id) {
      this.speakers = this.speakers.filter(s => s.id !== id)
    },

    addPresentation(speakerId, presentation) {
      const speaker = this.speakers.find(s => s.id === speakerId)
      if (speaker) {
        speaker.presentations.push({ ...presentation, id: Date.now() })
      }
    }
  }
})