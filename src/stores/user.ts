import { defineStore } from 'pinia';

export interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [] as User[],
        currentUser: null as User | null
    }),

    getters: {
        getUserById: (state) => (id: string) => {
            return state.users.find(user => user.id === id);
        },

        getAllUsers: (state) => state.users,

        isCurrentUserAdmin: (state) => state.currentUser?.isAdmin ?? false
    },

    actions: {
        addUser(user: User) {
            this.users.push(user);
        },

        updateUser(id: string, updatedUser: Partial<User>) {
            const index = this.users.findIndex(u => u.id === id);
            if (index !== -1) {
                this.users[index] = { ...this.users[index], ...updatedUser } as User;
            }
        },

        deleteUser(id: string) {
            this.users = this.users.filter(u => u.id !== id);
        },

        setCurrentUser(user: User | null) {
            this.currentUser = user;
        }
    }
});