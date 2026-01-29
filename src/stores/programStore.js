import { defineStore } from 'pinia'

export const useProgramStore = defineStore('program', {
  state: () => ({
    program: [
      {
        id: 1,
        title: 'Opening',
        speakerId: 1,
        room: 'Zaal A',
        startTime: '09:00',
        endTime: '09:30',
        type: 'session'
      }
    ]
  }),

  actions: {
    addProgramItem(item) {
      if (this.hasOverlap(item)) {
        alert('Deze zaal heeft al een item in dit tijdvak')
        return
      }
      this.program.push({ ...item, id: Date.now() })
    },

    hasOverlap(newItem) {
      return this.program.some(item => {
        return (
          item.room === newItem.room &&
          newItem.startTime < item.endTime &&
          newItem.endTime > item.startTime
        )
      })
    },

    removeProgramItem(id) {
      this.program = this.program.filter(i => i.id !== id)
    }
  }
})