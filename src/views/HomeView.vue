<script setup lang="ts">
import { MoonIcon, SunIcon, ShoppingCartIcon, Bars3Icon } from '@heroicons/vue/24/solid'
import {onMounted} from 'vue'
import { ref, computed } from 'vue'
import SpeakerGrid from '../components/SpeakerGrid.vue'
import TicketSidebar from '../components/TicketSidebar.vue'
import { useTicketStore } from '../stores/ticket'
import { useUserStore } from '../stores/user'
import DevUserSwitch from "../components/DevUserSwitch.vue";
import EventDisplay from "../components/EventDisplay.vue";
import { useShoppingCart } from '../composables/useShoppingCart'
import { useEventStore, DEFAULT_TICKET_TYPES, type Event } from '../stores/event'
import AddUserForm from "../components/addUserForm.vue";
import { useSidebar } from '../composables/useSidebar'
import Sidebar from '../components/Sidebar.vue'
import ShoppingCart from '../components/ShoppingCart.vue'
import TicketSelector from '../components/TicketSelector.vue'
import TestAdmin from '../views/TestAdmin.vue'


const { toggleSidebar, openSidebar } = useSidebar()
const showAddUserForm = ref(false)
const mobileMenuOpen = ref(false)
const isDarkMode = ref(false)
const activeTicketSelector = ref<string | null>(null)
const selectedEventId = ref<string | null>(null)
const ticketStore = useTicketStore()
const userStore = useUserStore()
const eventStore = useEventStore()
const { addToCart, isEmpty, getTotalItems, purchase } = useShoppingCart()

const events = computed(() => eventStore.events)

const handlePurchase = () => {
  purchase()
  // Maybe show a success message or redirect, but let's keep it simple as requested
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleAddUserForm = () => {
  showAddUserForm.value = !showAddUserForm.value
}

const openAdmin = (eventId: string) => {
  selectedEventId.value = eventId
}

const closeAdmin = () => {
  selectedEventId.value = null
}

const formatTime = (value: string | Date) => {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const demoEvent: Event = {
  id: 'evt-001',
  name: 'Vue.js Conference 2024',
  maxAttendees: 250,
  ticketTypes: DEFAULT_TICKET_TYPES,
  sessions: [
    {
      id: 'ses-001',
      start: new Date('2024-07-15T09:00:00'),
      end: new Date('2024-07-15T10:30:00'),
      speakerId: 'spk-001',
      type: 'lecture',
      location: 'Main Hall',
      title: 'Introduction to Vue 3 Composition API',
      description: 'Learn the fundamentals of Vue 3 Composition API and how to build modern applications.'
    },
    {
      id: 'ses-002',
      start: new Date('2024-07-15T10:30:00'),
      end: new Date('2024-07-15T11:00:00'),
      speakerId: 'spk-002',
      type: 'break',
      location: 'Lobby',
      title: 'Coffee Break',
      description: 'Network with other attendees and grab some refreshments.'
    },
    {
      id: 'ses-003',
      start: new Date('2024-07-15T11:00:00'),
      end: new Date('2024-07-15T12:30:00'),
      speakerId: 'spk-003',
      type: 'lecture',
      location: 'Room A',
      title: 'Advanced State Management with Pinia',
      description: 'Deep dive into Pinia store patterns and best practices for large applications.'
    },
    {
      id: 'ses-004',
      start: new Date('2024-07-15T18:00:00'),
      end: new Date('2024-07-15T20:00:00'),
      speakerId: 'spk-004',
      type: 'drinks',
      location: 'Rooftop Bar',
      title: 'Networking Drinks',
      description: 'Unwind with fellow developers and speakers over drinks and appetizers.'
    }
  ]
};

onMounted(() => {
  if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    isDarkMode.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDarkMode.value = false
  }

  // Initialize demo event if it doesn't exist
  if (!eventStore.getEventById('evt-001')) {
    eventStore.addEvent(demoEvent)
  }

  // Initialize cart with default items if empty
})

const toggleDarkMode = () => {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.theme = isDark ? 'dark' : 'light'
  isDarkMode.value = isDark
}

const buyTicket = (eventId: string, ticketType: TicketType) => {
  addToCart({
    eventId,
    ticketType
  })

  // Open sidebar when adding to cart
  openSidebar()
  activeTicketSelector.value = null
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
            transition-colors duration-300 cursor-pointer"
                  aria-label="Toggle dark mode">
            <MoonIcon v-if="!isDarkMode" class="h-6 w-6" />
            <SunIcon v-else class="h-6 w-6" />
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
          <button @click="toggleSidebar" class="py-1 px-3 rounded
            text-[#FF8A3D]
            hover:bg-[#FF8A3D] hover:text-[#3F3A56]
            transition-colors duration-300 cursor-pointer
            relative"
                  aria-label="Winkelwagen">
            <ShoppingCartIcon class="h-6 w-6" />
            <span
                v-if="!isEmpty()"
                class="absolute -top-1 -right-1
                bg-[#FF8A3D] text-white
                text-[10px] font-bold
                w-4 h-4 rounded-full
                flex items-center justify-center"
            >
              {{ getTotalItems() }}
            </span>
          </button>

          <!-- Mobile Menu Toggle -->
          <button @click="toggleMobileMenu" class="md:hidden p-1 text-[#FF8A3D] hover:bg-[#FF8A3D] hover:text-[#3F3A56] rounded transition-colors" aria-label="Menu">
            <Bars3Icon class="h-8 w-8" />
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

            <div class="relative">
              <button
                  @click="activeTicketSelector = activeTicketSelector === 'evt-001-main' ? null : 'evt-001-main'"
                  class="mt-4 w-full
							bg-[#FF8A3D] hover:bg-[#E6752F]
							text-white font-bold
							py-3 rounded-lg
							transition-colors cursor-pointer">
                Tickets bestellen
              </button>
              <TicketSelector
                  v-if="activeTicketSelector === 'evt-001-main'"
                  :ticket-types="eventStore.getEventById('evt-001')?.ticketTypes || []"
                  @select="(type) => buyTicket('evt-001', type)"
                  @close="activeTicketSelector = null"
              />
            </div>
          </div>
        </div>
      </section>
    </main>

    <section id="programma" class="bg-[#E7D6BC] dark:bg-[#12111A]">
      <div class="w-full max-w-6xl mx-auto mt-16 px-4">
        <h2 class="text-4xl font-bold mb-8 text-center
					text-[#3F3A56] dark:text-[#F3ECDD]">
          Programma
        </h2>

        <!-- Admin: Create New Event Button -->
        <div class="text-center mb-8" v-if="userStore.currentUser?.isAdmin">
          <button
              @click="selectedEventId = 'new'"
              class="bg-[#FF8A3D] hover:bg-[#E6752F] text-white font-bold px-6 py-3 rounded-lg transition"
          >
            ➕ Nieuw event aanmaken
          </button>
        </div>

        <div class="flex sm:flex-row gap-4 mb-5 items-center">
          <select class="px-4 py-2 rounded-md
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
						text-[#3F3A56] dark:text-[#F3ECDD]
						focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] cursor-pointer">
            <option>Alle zalen</option>
            <option>Zaal A</option>
            <option>Zaal B</option>
            <option>Zaal C</option>
          </select>

          <select class="px-4 py-2 rounded-md
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
						text-[#3F3A56] dark:text-[#F3ECDD]
						focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] cursor-pointer">
            <option>Alle tijden</option>
            <option>09:00 – 10:00</option>
            <option>10:00 – 11:00</option>
            <option>11:00 – 12:00</option>
          </select>
        </div>

        <hr class="w-full h-1 bg-[#FBF6EE] dark:bg-[#2A263A] mx-auto my-8 border-0 rounded-sm md:my-8">
        </hr>

        <div class="grid gap-6
					sm:grid-cols-2
					lg:grid-cols-3 pb-12">
          <!-- Card -->
          <div class="relative overflow-hidden
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
						rounded-lg shadow-md
						transition-colors
						flex flex-col h-full">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                   class="h-55 w-full object-cover" />

              <div class="absolute inset-0
								bg-gradient-to-t
								from-black/70 via-black/30 to-transparent"></div>

              <div class="absolute bottom-4 left-4 right-4 text-left">
                <h3 class="text-2xl font-bold text-white leading-tight">
                  Presentatie Hacklab
                </h3>
                <p class="text-base text-white/80">
                  Justin Bötger
                </p>
              </div>

              <div class="absolute top-4 right-4
								text-base font-semibold
								bg-[#FF8A3D] text-white
								px-3 py-1 rounded-full shadow">
                09:00 – 09:30
              </div>
            </div>

            <div class="p-6 text-left flex flex-col h-full">
              <p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
                Start van de Hackfront Conference met een korte introductie en
                overzicht van de dag.
              </p>

              <div class="mt-auto relative">
                <button
                    @click="activeTicketSelector = activeTicketSelector === 'evt-001-program-1' ? null : 'evt-001-program-1'"
                    class="mt-6 w-full
									bg-[#FF8A3D] hover:bg-[#E6752F]
									text-white font-semibold
									py-2 rounded-md
									transition-colors cursor-pointer">
                  Tickets
                </button>
                <TicketSelector
                    v-if="activeTicketSelector === 'evt-001-program-1'"
                    class="bottom-0"
                    :ticket-types="eventStore.getEventById('evt-001')?.ticketTypes || []"
                    @select="(type) => buyTicket('evt-001', type)"
                    @close="activeTicketSelector = null"
                />
              </div>
            </div>
          </div>
          <!-- Card END -->

          <!-- Card -->
          <div class="relative overflow-hidden
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
						rounded-lg shadow-md
						transition-colors
						flex flex-col h-full">
            <div class="relative">
              <img src="https://images.unsplash.com/photo-1625838144804-300f3907c110"
                   class="h-55 w-full object-cover" />

              <div class="absolute inset-0
								bg-gradient-to-t
								from-black/70 via-black/30 to-transparent"></div>

              <div class="absolute bottom-4 left-4 right-4 text-left">
                <h3 class="text-2xl font-bold text-white leading-tight">
                  Hackathon
                </h3>
                <p class="text-base text-white/80">
                  Justin Bötger
                </p>
              </div>

              <div class="absolute top-4 right-4
								text-base font-semibold
								bg-[#FF8A3D] text-white
								px-3 py-1 rounded-full shadow">
                11:00 – 15:30
              </div>
            </div>

            <div class="p-6 text-left flex flex-col h-full">
              <p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
                Een hackathon is een evenement waarin teams van deelnemers non-stop bezig gaan om binnen
                een korte tijd oplossingen voor aangereikte casussen te bedenken.
              </p>

              <div class="mt-auto relative">
                <button
                    @click="activeTicketSelector = activeTicketSelector === 'evt-001-program-2' ? null : 'evt-001-program-2'"
                    class="mt-6 w-full
									bg-[#FF8A3D] hover:bg-[#E6752F]
									text-white font-semibold
									py-2 rounded-md
									transition-colors cursor-pointer">
                  Tickets
                </button>
                <TicketSelector
                    v-if="activeTicketSelector === 'evt-001-program-2'"
                    class="bottom-0"
                    event-id="evt-001"
                    :ticket-types="eventStore.getEventById('evt-001')?.ticketTypes || []"
                    @select="(type) => buyTicket('evt-001', type)"
                    @close="activeTicketSelector = null"
                />
              </div>
            </div>
          </div>

          <div class="relative w-80 h-100 overflow-y-auto overflow-x-hidden border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10 rounded-xl bg-white dark:bg-[#2A263A] shadow-md">
            <EventDisplay :event="demoEvent" />
          </div>
          <!-- Card END -->

          <!-- Event Grid from Admin View -->
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
      </div>

      <!-- Test Admin Modal -->
      <TestAdmin
          v-if="selectedEventId"
          :eventId="selectedEventId"
          @close="closeAdmin"
      />
    </section>

    <section id="sprekers" class="bg-[#FBF6EE] dark:bg-[#1F1D2B]">
      <SpeakerGrid />
    </section>

    <Sidebar>
      <div class="p-4">
        <h3 class="text-xl font-bold mb-4 text-[#3F3A56] dark:text-[#F3ECDD]">Winkelwagen</h3>
        <ShoppingCart />
      </div>
    </Sidebar>

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