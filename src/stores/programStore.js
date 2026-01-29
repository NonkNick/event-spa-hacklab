import { defineStore } from 'pinia'

const STORAGE_KEY = 'program'

export const useProgramStore = defineStore('program', {
  state: () => ({
    program: JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  }),

  actions: {
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.program))
    },

    addProgramItem(item) {
      if (this.hasOverlap(item)) {
        alert('Deze zaal heeft al een item in dit tijdvak')
        return
      }
      this.program.push({
        ...item,
        id: Date.now()
      })
      this.saveToStorage()
    },

    removeProgramItem(id) {
      this.program = this.program.filter(i => i.id !== id)
      this.saveToStorage()
    },

    hasOverlap(newItem) {
      return this.program.some(item => {
        return (
          item.room === newItem.room &&
          newItem.startTime < item.endTime &&
          newItem.endTime > item.startTime
        )
      })
    }
  }
})