import { defineStore } from 'pinia'

interface User {
    id: string
    name: string
    email: string
    isAdmin: boolean
}

export const useUserStore = defineStore('users', {
    state: () => ({
        currentUser: null as User | null
    }),

    getters: {
        // Get current user
        user: (state) => state.currentUser,

        // Check if admin
        isAdmin: (state) => state.currentUser?.isAdmin || false,

        // Check if logged in
        isLoggedIn: (state) => state.currentUser !== null
    },

    actions: {
        setUser(user: User | null) {
            this.currentUser = user
        },

        logout() {
            this.currentUser = null
        }
    }
})