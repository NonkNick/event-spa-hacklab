<template>
	<div>
		<!-- Ticket Sidebar Toggle Button -->
		<button
			@click="sidebarOpen = !sidebarOpen"
			class="py-1 px-3 rounded
			text-[#FF8A3D]
			hover:bg-[#FF8A3D] hover:text-[#3F3A56]
			transition-colors duration-300
			relative"
			aria-label="Tickets"
		>
			<TicketIcon class="h-6 w-6" />
			<span
				v-if="userTickets.length > 0"
				class="absolute -top-1 -right-1
				bg-[#FF8A3D] text-white
				text-xs font-bold
				w-5 h-5 rounded-full
				flex items-center justify-center"
			>
				{{ userTickets.length }}
			</span>
		</button>

		<!-- Overlay -->
		<transition
			enter-active-class="transition-opacity duration-300"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition-opacity duration-300"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="sidebarOpen"
				class="fixed inset-0 bg-black/50 z-40"
				@click="sidebarOpen = false"
			></div>
		</transition>

		<!-- Sidebar -->
		<transition
			enter-active-class="transition ease-out duration-300"
			enter-from-class="translate-x-full"
			enter-to-class="translate-x-0"
			leave-active-class="transition ease-in duration-300"
			leave-from-class="translate-x-0"
			leave-to-class="translate-x-full"
		>
			<div
				v-if="sidebarOpen"
				class="fixed right-0 top-0 h-screen
				bg-white dark:bg-[#2A263A]
				border-l border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
				w-80 shadow-2xl
				z-50 flex flex-col"
			>
				<!-- Header -->
				<div
					class="bg-[#e7d6bc] dark:bg-[#3A344C]
					border-b border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
					px-4 py-3 flex items-center justify-between"
				>
					<h3 class="font-bold text-[#3F3A56] dark:text-[#F3ECDD]">
						Jouw tickets
					</h3>
					<button
						@click="sidebarOpen = false"
						class="text-[#3F3A56] dark:text-[#F3ECDD]
						hover:text-[#FF8A3D]
						transition-colors"
						aria-label="Sluit sidebar"
					>
						<XMarkIcon class="h-6 w-6" />
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-4">
					<div v-if="userTickets.length === 0" class="text-center py-8">
						<p class="text-[#6B647A] dark:text-[#D6CCE5] text-sm">
							Je hebt nog geen tickets gekocht
						</p>
					</div>

					<div v-else>
						<div class="flex items-center justify-between mb-3">
							<span
								class="font-semibold text-sm text-[#3F3A56] dark:text-[#F3ECDD]"
							>
								Gekochte tickets
							</span>

							<button
								@click="showTickets = !showTickets"
								class="text-sm text-[#3F3A56] dark:text-[#F3ECDD]
								hover:text-[#FF8A3D] transition-colors flex items-center gap-1"
							>
								<template v-if="showTickets">
                  Verbergen
                  <ChevronUpIcon class="h-4 w-4" />
                </template>
								<template v-else>
                  Toon ({{ userTickets.length }})
                  <ChevronDownIcon class="h-4 w-4" />
                </template>
							</button>
						</div>

						<transition name="fade">
							<div v-if="showTickets" class="space-y-3">
								<div
									v-for="ticket in userTickets"
									:key="ticket.id"
									class="bg-[#FBF6EE] dark:bg-[#1F1D2B]
									border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
									rounded-lg p-3
									transition-colors"
								>
									<div class="flex items-start justify-between mb-2">
										<div>
											<h4 class="font-bold text-[#3F3A56] dark:text-[#F3ECDD]">
												{{ ticket.name }}
											</h4>
											<p v-if="ticket.ticketType" class="text-xs text-[#6B647A] dark:text-[#D6CCE5]">
												{{ ticket.ticketType }}
											</p>
										</div>
										<span
											class="bg-[#FF8A3D] text-white
											text-xs font-semibold
											px-2 py-1 rounded-full"
										>
											Geldig
										</span>
									</div>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5] mb-1">
										Locatie: {{ ticket.location ?? '—' }}
									</p>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5] mb-1">
										Tijd: {{ ticket.eventTime ?? '—' }}
									</p>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5]">
										Datum: {{ ticket.eventDate ?? '—' }}
									</p>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TicketIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '../stores/user'
import { useTicketStore } from '../stores/ticket'

const sidebarOpen = ref(false)
const showTickets = ref(true)

const userStore = useUserStore()
const ticketStore = useTicketStore()

const userTickets = computed(() => {
	const uid = userStore.currentUser?.id
	if (!uid) return []
	return ticketStore.getTicketsByUserId(uid)
})

</script>
