import { defineStore } from 'pinia'

const STORAGE_KEY = 'event'

const defaultEvent = {
  title: 'Hacklab Conferentie 2026',
  description: 'Een conferentie over Vue.js',
  location: 'Leeuwarden',
  date: '2026-06-12',
  startTime: '09:00',
  endTime: '18:00'
}

export const useEventStore = defineStore('event', {
  state: () => ({
    event: JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultEvent
  }),

  actions: {
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.event))
    },

    updateEvent(event) {
      this.event = event
      this.saveToStorage()
    }
  }
})