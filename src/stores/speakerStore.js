import { defineStore } from 'pinia'

const STORAGE_KEY = 'speakers'

export const useSpeakerStore = defineStore('speakers', {
  state: () => ({
    speakers: JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  }),

  actions: {
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.speakers))
    },

    addSpeaker(speaker) {
      this.speakers.push({
        ...speaker,
        id: Date.now(),
        presentations: []
      })
      this.saveToStorage()
    },

    removeSpeaker(id) {
      this.speakers = this.speakers.filter(s => s.id !== id)
      this.saveToStorage()
    },

    editSpeaker(updatedSpeaker) {
      const index = this.speakers.findIndex(s => s.id === updatedSpeaker.id)
      if (index !== -1) {
        this.speakers[index] = {
          ...this.speakers[index],
          ...updatedSpeaker
        }
        this.saveToStorage()
      }
    },

    addPresentation(speakerId, presentation) {
      const speaker = this.speakers.find(s => s.id === speakerId)
      if (speaker) {
        speaker.presentations.push({
          ...presentation,
          id: Date.now()
        })
        this.saveToStorage()
      }
    }
  }
})