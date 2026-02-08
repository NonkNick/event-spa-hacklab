<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import SpeakerGrid from '../components/SpeakerGrid.vue'
import EventGrid from '../components/EventGrid.vue'
import TicketSidebar from '../components/TicketSidebar.vue'
import { useTicketStore } from '../stores/ticket'
import { useUserStore } from '../stores/user'

const mobileMenuOpen = ref(false)
const ticketStore = useTicketStore()
const userStore = useUserStore()

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
			isAdmin: false
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
	const ticket = {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		eventId,
		userId,
		name,
		price,
		location,
		eventDate,
		eventTime,
		createdAt: new Date()
	}
	ticketStore.addTicket(ticket)
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
			<div class="flex items-center justify-between
				px-4 md:px-6 py-4">
				<div class="flex items-center">
					<a href="/" class="flex items-center">
						<img src="../assets/images/eventlab-logo.png" alt="Logo"
							class="h-10 w-10 md:h-12 md:w-12 mr-3" />
						<div class="font-bold text-xl md:text-2xl">
							EventLab
						</div>
					</a>
				</div>

				<ul class="hidden md:flex
					items-center gap-12 text-lg">
					<RouterLink to="/#events" class="hover:text-[#FF8A3D]">
						Events
					</RouterLink>
					<RouterLink to="/#sprekers" class="hover:text-[#FF8A3D]">
						Sprekers
					</RouterLink>
				</ul>

				<div class="flex items-center gap-4">
					<button @click="toggleDarkMode" class="py-1 px-3 rounded
						text-[#FF8A3D]
						hover:bg-[#FF8A3D] hover:text-[#3F3A56]
						transition-colors duration-300 cursor-pointer">
						🌙 / ☀️
					</button>

					<TicketSidebar />

					<button @click="toggleMobileMenu" class="md:hidden text-2xl" aria-label="Menu">
						☰
					</button>
				</div>
			</div>

			<div v-if="mobileMenuOpen" class="md:hidden
				bg-[#e7d6bc] dark:bg-[#3A344C]
				border-t border-[#3F3A56]/10">
				<ul class="flex flex-col text-center py-4 gap-0">
					<li class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false">
						<RouterLink to="/#events" class="hover:text-[#FF8A3D]">
							Events
						</RouterLink>
					</li>
					<li class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false">
						<RouterLink to="/#sprekers" class="hover:text-[#FF8A3D]">
							Sprekers
						</RouterLink>
					</li>
				</ul>
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
		</main>

		<section id="events" class="bg-[#FBF6EE] dark:bg-[#1F1D2B]">
			<EventGrid />
		</section>

		<section id="sprekers" class="bg-[#FBF6EE] dark:bg-[#1F1D2B]">
			<SpeakerGrid />
		</section>

		<footer class="w-full py-6 text-center
			bg-[#3F3A56] dark:bg-[#2C2740]
			text-[#FFF]">
			© 2026 EventLab
		</footer>
	</div>
</template>
