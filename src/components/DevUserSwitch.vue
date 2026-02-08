<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user.ts'

const userStore = useUserStore()

// bridge v-model <select> ↔ currentUser
const selectedUserId = computed({
  get: () => userStore.currentUser?.id ?? '',
  set: (id: string) => {
    const user = userStore.getUserById(id)
    userStore.setCurrentUser(user ?? null)
  },
})
</script>

<template>
  <label>
    <span>User</span>

    <select v-model="selectedUserId">
      <option value="">— No user —</option>

      <option
          v-for="user in userStore.getAllUsers"
          :key="user.id"
          :value="user.id"
      >
        {{ user.name }}
      </option>
    </select>
  </label>

  <p v-if="userStore.currentUser">
    Logged in as: {{ userStore.currentUser.name }}
  </p>
</template>
