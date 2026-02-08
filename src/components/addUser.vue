<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore, type User } from '../stores/user'

const userStore = useUserStore()

const form = reactive({
  name: '',
  email: '',
  isAdmin: false,
})

function resetForm() {
  form.name = ''
  form.email = ''
  form.isAdmin = false
}

// generate unique ID that doesn't exist in the store
function generateUniqueId(): string {
  let id: string
  do {
    id = crypto.randomUUID()
  } while (userStore.getUserById(id))
  return id
}

function submit() {
  if (!form.name || !form.email) return

  const newUser: User = {
    id: generateUniqueId(),
    name: form.name,
    email: form.email,
    isAdmin: form.isAdmin,
  }

  userStore.addUser(newUser)
  resetForm()
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-3">
    <div>
      <label>Name</label>
      <input
          v-model="form.name"
          type="text"
          required
      />
    </div>

    <div>
      <label>Email</label>
      <input
          v-model="form.email"
          type="email"
          required
      />
    </div>

    <div>
      <label>
        <input
            type="checkbox"
            v-model="form.isAdmin"
        />
        Admin
      </label>
    </div>

    <button type="submit">
      Create user
    </button>
  </form>
</template>
