import { ref, watch } from 'vue'
import { useEventStore } from '../stores/event'
import { useTicketStore } from '../stores/ticket'
import { useUserStore } from '../stores/user'
import type { TicketType } from '../stores/event'

export interface CartItem {
    eventId: string
    ticketType: TicketType
    quantity: number
}
function initializeCart(): CartItem[] {
    try {
        const stored = localStorage.getItem('shoppingcart')
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Error reading cart from localStorage:', error)
        return []
    }
}

const cart = ref<CartItem[]>(initializeCart())

watch(
    cart,
    (newCart) => {
        try {
            localStorage.setItem('shoppingcart', JSON.stringify(newCart))
        } catch (error) {
            console.error('Error saving cart to localStorage:', error)
        }
    },
    { deep: true }
)

export function useShoppingCart() {
    const eventStore = useEventStore()
    const ticketStore = useTicketStore()
    const userStore = useUserStore()

    const isSameItem = (item: CartItem, eventId: string, ticketType: TicketType): boolean => {
        return item.eventId === eventId && item.ticketType.name === ticketType.name
    }

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        const existing = cart.value.find(
            cartItem => isSameItem(cartItem, item.eventId, item.ticketType)
        )

        if (existing) {
            existing.quantity++
        } else {
            cart.value.push({ ...item, quantity: 1 })
        }
    }

    const removeFromCart = (eventId: string, ticketType: TicketType) => {
        cart.value = cart.value.filter(
            item => !isSameItem(item, eventId, ticketType)
        )
    }

    const increaseAmount = (eventId: string, ticketType: TicketType) => {
        const item = cart.value.find(
            cartItem => isSameItem(cartItem, eventId, ticketType)
        )

        if (item) {
            item.quantity++
        }
    }

    const decreaseAmount = (eventId: string, ticketType: TicketType) => {
        const item = cart.value.find(
            cartItem => isSameItem(cartItem, eventId, ticketType)
        )

        if (!item) return

        item.quantity--

        if (item.quantity <= 0) {
            removeFromCart(eventId, ticketType)
        }
    }

    const clearCart = () => {
        cart.value = []
    }

    const purchase = async () => {
        const userId = userStore.currentUser?.id ?? 'demo-user'
        const orderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`

        for (const cartItem of cart.value) {
            const event = eventStore.getEventById(cartItem.eventId)
            if (!event) {
                console.warn(`Event ${cartItem.eventId} not found`)
                continue
            }

            const session = event.sessions[0]
            if (!session) {
                console.warn(`No sessions found for event ${cartItem.eventId}`)
                continue
            }

            for (let i = 0; i < cartItem.quantity; i++) {
                const startDate = new Date(session.start)
                const newTicket = {
                    id: crypto.randomUUID(),
                    eventId: event.id,
                    userId,
                    name: event.name,
                    ticketType: cartItem.ticketType.name,
                    price: cartItem.ticketType.price,
                    location: session.location,
                    eventDate: startDate.toISOString(),
                    eventTime: startDate.toLocaleTimeString('nl-NL', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    createdAt: new Date()
                }

                ticketStore.addTicket(newTicket)
            }
        }

        // Save order to localStorage
        const order = {
            id: orderId,
            items: cart.value.map(item => ({...item})),
            total: getTotalPrice(),
            date: new Date().toISOString()
        }
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
        existingOrders.push(order)
        localStorage.setItem('orders', JSON.stringify(existingOrders))

        clearCart()
        return orderId
    }

    const getTotalItems = () => {
        return cart.value.reduce((sum, item) => sum + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return cart.value.reduce((sum, item) => sum + item.ticketType.price * item.quantity, 0)
    }

    const isEmpty = () => {
        return cart.value.length === 0
    }

    return {
        cart,
        addToCart,
        removeFromCart,
        increaseAmount,
        decreaseAmount,
        clearCart,
        purchase,
        getTotalItems,
        getTotalPrice,
        isEmpty
    }
}