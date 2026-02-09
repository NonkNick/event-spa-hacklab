<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import SpeakerGrid from '../components/SpeakerGrid.vue'
import TicketSidebar from '../components/TicketSidebar.vue'
import TestAdmin from '../views/TestAdmin.vue'

import { useTicketStore } from '../stores/ticket'
import { useUserStore } from '../stores/user'
import { useEventStore } from '../stores/event'

const mobileMenuOpen = ref(false)

const ticketStore = useTicketStore()
const userStore = useUserStore()
const eventStore = useEventStore()

const events = computed(() => eventStore.events)

const selectedEventId = ref<string | null>(null)

function openAdmin(eventId: string) {
  selectedEventId.value = eventId
}

function closeAdmin() {
  selectedEventId.value = null
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(() => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  if (!userStore.currentUser) {
    userStore.setCurrentUser({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      isAdmin: true
    })
  }
})

const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
}

const buyTicket = (
  eventId: string,
  name: string,
  price: number,
  location?: string,
  eventDate?: string,
  eventTime?: string
) => {
  const userId = userStore.currentUser?.id ?? 'demo-user'
  ticketStore.addTicket({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    eventId,
    userId,
    name,
    price,
    location,
    eventDate,
    eventTime,
    createdAt: new Date()
  })
}

function formatTime(value: string | Date) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#FBF6EE] dark:bg-[#1F1D2B] text-[#3F3A56] dark:text-[#F3ECDD] transition-colors">

    <!-- NAV -->
    <nav class="w-full bg-[#e7d6bc] dark:bg-[#3A344C] shadow-md">
      <div class="flex justify-between items-center px-6 py-4">
        <RouterLink to="/" class="flex items-center gap-3">
          <img src="../assets/images/eventlab-logo.png" class="h-10" />
          <span class="font-bold text-2xl">EventLab</span>
        </RouterLink>

        <div class="flex gap-4">
          <button @click="toggleDarkMode">🌙 / ☀️</button>
          <TicketSidebar />
          <button @click="toggleMobileMenu" class="md:hidden text-2xl">☰</button>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <main class="flex-1">
      <section class="max-w-6xl mx-auto px-4 py-12">
        <div class="bg-white dark:bg-[#2A263A] rounded-xl shadow-lg overflow-hidden">
          <div class="relative h-80">
            <img src="https://images.unsplash.com/photo-1503428593586-e225b39bddfe"
              class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <div class="absolute bottom-6 left-6 text-white">
              <span class="bg-[#FF8A3D] px-4 py-1 rounded-full text-sm font-semibold">
                Welkom bij Hackfront Conference 2026!
              </span>
              <h1 class="text-4xl font-bold mt-2">Hackfront Conference 2026</h1>
              <p class="opacity-80">Door Justin Bötger</p>
            </div>
          </div>

          <div class="p-8 grid md:grid-cols-3 gap-6">
            <p class="md:col-span-2 text-lg text-[#6B647A] dark:text-[#D6CCE5]">
              Waar code en creativiteit samenkomen, ontstaat de toekomst van het web.
            </p>

            <div class="space-y-2">
              <div><b>Locatie:</b> Zaal A</div>
              <div><b>Datum:</b> 25-10-2026</div>
              <div><b>Tijd:</b> 09:00 – 10:00</div>

              <button
                @click="buyTicket('Hackfront', 'Hackfront', 10, 'Zaal A', '25-10-2026', '09:00')"
                class="mt-4 w-full bg-[#FF8A3D] text-white py-3 rounded-lg">
                Tickets bestellen
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- PROGRAMMA -->
    <section id="programma" class="bg-[#FBF6EE] dark:bg-[#1F1D2B] py-16">
  <div class="max-w-6xl mx-auto px-4">

    <h2 class="text-4xl font-bold mb-10 text-center">
      Programma
    </h2>

    <!-- ✅ NIEUWE KNOP -->
    <div class="text-center mb-8" v-if="userStore.currentUser?.isAdmin">
      <button
        @click="selectedEventId = 'new'"
        class="bg-[#FF8A3D] hover:bg-[#E6752F] text-white font-bold px-6 py-3 rounded-lg transition"
      >
        ➕ Nieuw event aanmaken
      </button>
    </div>
  </div>

   <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <div
    v-for="event in events"
    :key="event.id"
    class="bg-white dark:bg-[#2A263A]
           border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
           rounded-xl shadow-md
           transition-colors
           flex flex-col"
  >

  </div>
</div>
<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <div
    v-for="event in events"
    :key="event.id"
    @click="openAdmin(event.id)"
    class="bg-white dark:bg-[#2A263A]
           border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
           rounded-xl shadow-md
           p-6 cursor-pointer hover:scale-[1.02] transition
           flex flex-col justify-between"
  >
    <div>
      <h3 class="text-xl font-bold mb-2">
        {{ event.name }}
      </h3>

      <p class="text-sm mb-2">
        Max bezoekers: {{ event.maxAttendees }}
      </p>

      <ul class="text-sm space-y-1">
        <li v-for="s in event.sessions" :key="s.id">
          {{ s.title }} — {{ formatTime(s.start) }} - {{ formatTime(s.end) }}
          ({{ s.location }})
        </li>
      </ul>
    </div>

    <button
      class="mt-4 bg-[#FF8A3D] text-white px-3 py-2 rounded"
    >
      Beheer event
    </button>
  </div>
</div>

  <TestAdmin
    v-if="selectedEventId"
    :eventId="selectedEventId"
    @close="closeAdmin"
  />
</section>

      <!-- SPEAKERS -->
      <section id="sprekers">
        <SpeakerGrid />
      </section>
    </main>

    <footer class="py-6 text-center bg-[#3F3A56] text-white">
      © 2026 EventLab
    </footer>
  </div>
</template>