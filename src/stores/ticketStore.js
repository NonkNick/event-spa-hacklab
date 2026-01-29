import { defineStore } from 'pinia'

const STORAGE_KEY = 'tickets'

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    data: JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      tickets: [
        { id: 1, name: 'Standaard', price: 49, stock: 100 },
        { id: 2, name: 'VIP', price: 99, stock: 20 }
      ],
      cart: [],
      orders: []
    }
  }),

  getters: {
    tickets: state => state.data.tickets,
    cart: state => state.data.cart,
    orders: state => state.data.orders,

    totalPrice(state) {
      return state.data.cart.reduce((total, item) => {
        const ticket = state.data.tickets.find(t => t.id === item.ticketId)
        return total + ticket.price * item.quantity
      }, 0)
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
    },

    addToCart(ticketId) {
      const existing = this.data.cart.find(i => i.ticketId === ticketId)

      if (existing) {
        existing.quantity++
      } else {
        this.data.cart.push({ ticketId, quantity: 1 })
      }
      this.saveToStorage()
    },

    removeFromCart(ticketId) {
      this.data.cart = this.data.cart.filter(i => i.ticketId !== ticketId)
      this.saveToStorage()
    },

    checkout(customer) {
      const order = {
        id: 'ORD' + Date.now(),
        items: this.data.cart,
        totalPrice: this.totalPrice,
        date: new Date().toISOString(),
        customer
      }

      this.data.cart.forEach(item => {
        const ticket = this.data.tickets.find(t => t.id === item.ticketId)
        ticket.stock -= item.quantity
      })

      this.data.orders.push(order)
      this.data.cart = []

      this.saveToStorage()
      return order
    }
  }
})