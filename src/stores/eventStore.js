import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', {
  state: () => ({
    event: {
      title: 'Hackfront Conferentie',
      description: 'Een conferentie over Vue.js',
      location: 'Leeuwarden',
      date: '2026-06-12',
      startTime: '09:00',
      endTime: '18:00'
    }
  }),

  actions: {
    updateEvent(event) {
      this.event = event
    }
  }
})