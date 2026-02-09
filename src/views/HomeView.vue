<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import SpeakerGrid from '../components/SpeakerGrid.vue'
import TicketSidebar from '../components/TicketSidebar.vue'
import DevUserSwitch from '../components/DevUserSwitch.vue'
import AddUserForm from '../components/addUserForm.vue'
import TestAdmin from '../views/TestAdmin.vue'

import { useTicketStore } from '../stores/ticket'
import { useUserStore } from '../stores/user'
import { useEventStore } from '../stores/event'

import type { Event } from '../stores/event.ts'

const eventStore = useEventStore()
const ticketStore = useTicketStore()
const userStore = useUserStore()

const selectedEventId = ref<string | null>(null)
const showAddUserForm = ref(false)
const mobileMenuOpen = ref(false)

const events = computed(() => eventStore.events)

function openAdmin(eventId: string) {
  selectedEventId.value = eventId
}

function closeAdmin() {
  selectedEventId.value = null
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function toggleAddUserForm() {
  showAddUserForm.value = !showAddUserForm.value
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
}

function buyTicket(
  eventId: string,
  name: string,
  price: number,
  location?: string,
  eventDate?: string,
  eventTime?: string
) {
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
})

const demoEvent: Event = {
  id: 'evt-001',
  name: 'Vue.js Conference 2024',
  maxAttendees: 250,
  sessions: [
    {
      id: 'ses-001',
      start: new Date('2024-07-15T09:00:00'),
      end: new Date('2024-07-15T10:30:00'),
      speakerId: 'spk-001',
      type: 'lecture',
      location: 'Main Hall',
      title: 'Introduction to Vue 3 Composition API',
      description:
        'Learn the fundamentals of Vue 3 Composition API and how to build modern applications.'
    },
    {
      id: 'ses-002',
      start: new Date('2024-07-15T10:30:00'),
      end: new Date('2024-07-15T11:00:00'),
      speakerId: 'spk-002',
      type: 'break',
      location: 'Lobby',
      title: 'Coffee Break',
      description:
        'Network with other attendees and grab some refreshments.'
    },
    {
      id: 'ses-003',
      start: new Date('2024-07-15T11:00:00'),
      end: new Date('2024-07-15T12:30:00'),
      speakerId: 'spk-003',
      type: 'lecture',
      location: 'Room A',
      title: 'Advanced State Management with Pinia',
      description:
        'Deep dive into Pinia store patterns and best practices for large applications.'
    },
    {
      id: 'ses-004',
      start: new Date('2024-07-15T18:00:00'),
      end: new Date('2024-07-15T20:00:00'),
      speakerId: 'spk-004',
      type: 'drinks',
      location: 'Rooftop Bar',
      title: 'Networking Drinks',
      description:
        'Unwind with fellow developers and speakers over drinks and appetizers.'
    }
  ]
}
</script>

<template>
	<div class="flex flex-col min-h-screen
		bg-[#FBF6EE] dark:bg-[#1F1D2B]
		text-[#3F3A56] dark:text-[#F3ECDD]
		transition-colors duration-300">
    <nav class="w-full
      bg-[#e7d6bc] dark:bg-[#3A344C]
      text-[#3F3A56] dark:text-[#F3ECDD]
      shadow-md">
      <div class="flex items-center justify-between px-4 md:px-6 py-4">

        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center">
            <img src="../assets/images/eventlab-logo.png" alt="Logo"
                 class="h-10 w-10 md:h-12 md:w-12 mr-3" />
            <div class="font-bold text-xl md:text-2xl">
              EventLab
            </div>
          </a>
        </div>

        <!-- Desktop Menu -->
        <ul class="hidden md:flex items-center gap-12 text-lg">
          <RouterLink to="/#programma" class="hover:text-[#FF8A3D]">
            Programma
          </RouterLink>
          <RouterLink to="/#sprekers" class="hover:text-[#FF8A3D]">
            Sprekers
          </RouterLink>
        </ul>

        <div class="flex items-center gap-4 relative">

          <!-- Dark Mode Toggle -->
          <button @click="toggleDarkMode" class="py-1 px-3 rounded
            text-[#FF8A3D]
            hover:bg-[#FF8A3D] hover:text-[#3F3A56]
            transition-colors duration-300 cursor-pointer">
            🌙 / ☀️
          </button>

          <!-- Add User Button -->
          <div class="relative">
            <button
                @click="toggleAddUserForm"
                class="py-1 px-3 rounded bg-[#FF8A3D] text-white
                     hover:bg-[#E6752F] transition-colors">
              Add User
            </button>

            <div
                v-if="showAddUserForm"
                class="absolute right-0 mt-2 z-50">
              <AddUserForm @created="showAddUserForm = false" />
            </div>
          </div>

          <!-- Ticket Sidebar -->
          <TicketSidebar />

          <!-- Mobile Menu Toggle -->
          <button @click="toggleMobileMenu" class="md:hidden text-2xl" aria-label="Menu">
            ☰
          </button>

        </div>
      </div>

      <!-- MOBILE MENU -->
      <div v-if="mobileMenuOpen" class="md:hidden
        bg-[#e7d6bc] dark:bg-[#3A344C]
        border-t border-[#3F3A56]/10">
        <ul class="flex flex-col text-center py-4 gap-0">
          <li class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
              @click="mobileMenuOpen = false">
            <RouterLink to="/#programma" class="hover:text-[#FF8A3D]">
              Programma
            </RouterLink>
          </li>
          <li class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
              @click="mobileMenuOpen = false">
            <RouterLink to="/#sprekers" class="hover:text-[#FF8A3D]">
              Sprekers
            </RouterLink>
          </li>
          <li class="py-3">
            <button
                @click="toggleAddUserForm"
                class="w-full py-2 px-4 rounded bg-[#FF8A3D] text-white hover:bg-[#E6752F] transition-colors">
              Add User
            </button>
          </li>
        </ul>

        <!-- Mobile popover -->
        <div v-if="showAddUserForm" id="add-user-popover" class="p-4 bg-white dark:bg-[#2A263A] rounded-lg shadow-lg mt-2">
          <AddUserForm @created="showAddUserForm = false" />
        </div>
      </div>
    </nav>

		<main class="flex-1 flex flex-col items-center text-center gap-8 py-12 px-4
			bg-[#FBF6EE] dark:bg-[#1F1D2B]">
			<section class="w-full max-w-6xl
				bg-white dark:bg-[#2A263A]
				rounded-xl shadow-lg overflow-hidden
				transition-colors">
				<div class="relative h-80">
					<img src="https://images.unsplash.com/photo-1503428593586-e225b39bddfe"
						class="absolute inset-0 w-full h-full object-cover" />

					<div class="absolute inset-0
						bg-gradient-to-t
						from-black/80 via-black/40 to-transparent"></div>

					<div class="absolute bottom-6 left-6 right-6 text-left">
						<span class="inline-block mb-3
							bg-[#FF8A3D] text-white
							px-4 py-1 rounded-full text-sm font-semibold">
							Welkom bij Hackfront Conference 2026!
						</span>

						<h1 class="text-4xl font-bold text-white mb-2">
							Hackfront Conference 2026
						</h1>

						<p class="text-lg text-white/80">
							Door Justin Bötger
						</p>
					</div>
				</div>

				<div class="p-8 grid md:grid-cols-3 gap-6 text-left">
					<div class="md:col-span-2">
						<p class="text-[#6B647A] dark:text-[#D6CCE5] text-lg leading-relaxed">
							Waar code en creativiteit samenkomen, ontstaat de toekomst van het web. Vandaag staan we aan
							de vooravond van een nieuwe golf van innovatie, gedreven door de passie en expertise van de
							frontend community. Laten we samen de grenzen verleggen van wat mogelijk is en de toekomst
							van web development vormgeven.
						</p>
					</div>

					<div class="space-y-3 text-base">
						<div>
							<span class="font-bold">Locatie:</span> Zaal A
						</div>
						<div>
							<span class="font-bold">Datum:</span> 25-10-2026
						</div>
						<div>
							<span class="font-bold">Tijd:</span> 09:00 – 10:00
						</div>

						<button 
							@click="buyTicket('Hackfront Conference 2026', 'Hackfront Conference 2026', 10, 'Zaal A', '25-10-2026', '09:00 – 10:00')"
							class="mt-4 w-full
							bg-[#FF8A3D] hover:bg-[#E6752F]
							text-white font-bold
							py-3 rounded-lg
							transition-colors cursor-pointer">
							Tickets bestellen
						</button>
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

		<section id="sprekers" class="bg-[#FBF6EE] dark:bg-[#1F1D2B]">
			<SpeakerGrid />
		</section>
    </main>

    <footer class="w-full py-6
               bg-[#3F3A56] dark:bg-[#2C2740]
               text-white
               relative
               transition-colors">

      <!-- Dev Switch (floating above content, small) -->
      <div class="absolute top-2 right-4 md:top-3 md:right-6">
        <DevUserSwitch />
      </div>

      <!-- Centered copyright -->
      <div class="text-center text-sm md:text-base">
        © 2026 EventLab
      </div>
    </footer>


	</div>
</template>
