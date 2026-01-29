import { defineStore } from 'pinia'

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: [
      { id: 1, name: 'Standaard', price: 49, stock: 100 },
      { id: 2, name: 'VIP', price: 99, stock: 20 }
    ],
    cart: [],
    orders: []
  }),

  getters: {
    totalPrice(state) {
      return state.cart.reduce((total, item) => {
        const ticket = state.tickets.find(t => t.id === item.ticketId)
        return total + ticket.price * item.quantity
      }, 0)
    }
  },

  actions: {
    addToCart(ticketId) {
      const existing = this.cart.find(i => i.ticketId === ticketId)
      if (existing) {
        existing.quantity++
      } else {
        this.cart.push({ ticketId, quantity: 1 })
      }
    },

    removeFromCart(ticketId) {
      this.cart = this.cart.filter(i => i.ticketId !== ticketId)
    },

    checkout(customer) {
      const order = {
        id: 'ORD' + Date.now(),
        items: this.cart,
        totalPrice: this.totalPrice,
        date: new Date().toISOString(),
        customer
      }

      // voorraad aanpassen
      this.cart.forEach(item => {
        const ticket = this.tickets.find(t => t.id === item.ticketId)
        ticket.stock -= item.quantity
      })

      this.orders.push(order)
      this.cart = []

      return order
    }
  }
})