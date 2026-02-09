<script setup lang="ts">
import { reactive } from 'vue'
import { useUserStore, type User } from '../stores/user'

const emit = defineEmits(['created'])

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

  // emit an event to notify the parent
  emit('created')
}
</script>
<template>
  <section class="w-full max-w-md
                  bg-white dark:bg-[#2A263A]
                  rounded-xl
                  shadow-lg
                  p-6
                  transition-colors">
    <form @submit.prevent="submit" class="space-y-5">
      <!-- Name -->
      <div class="flex flex-col">
        <label class="mb-1 font-semibold text-[#3F3A56] dark:text-[#F3ECDD]">Name</label>
        <input
            v-model="form.name"
            type="text"
            required
            class="px-3 py-2 rounded-lg
                 border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
                 bg-[#FBF6EE] dark:bg-[#1F1D2B]
                 text-[#3F3A56] dark:text-[#F3ECDD]
                 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] focus:border-[#FF8A3D]"
        />
      </div>

      <!-- Email -->
      <div class="flex flex-col">
        <label class="mb-1 font-semibold text-[#3F3A56] dark:text-[#F3ECDD]">Email</label>
        <input
            v-model="form.email"
            type="email"
            required
            class="px-3 py-2 rounded-lg
                 border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
                 bg-[#FBF6EE] dark:bg-[#1F1D2B]
                 text-[#3F3A56] dark:text-[#F3ECDD]
                 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] focus:border-[#FF8A3D]"
        />
      </div>

      <!-- Admin Checkbox -->
      <div class="flex items-center gap-2">
        <input
            type="checkbox"
            v-model="form.isAdmin"
            id="isAdmin"
            class="w-4 h-4 accent-[#FF8A3D]"
        />
        <label for="isAdmin" class="font-semibold text-[#3F3A56] dark:text-[#F3ECDD]">Admin</label>
      </div>

      <button type="submit"
              class="w-full mt-2
                     bg-[#FF8A3D] hover:bg-[#E6752F]
                     text-white font-bold
                     py-3 rounded-xl
                     transition-colors cursor-pointer">
        Create User
      </button>
    </form>
  </section>
</template>
