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
			🎟️
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

		<!-- Overlay to close sidebar when clicking outside -->
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

		<!-- Sidebar Slide-in -->
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
						Your Tickets
					</h3>
					<button
						@click="sidebarOpen = false"
						class="text-[#3F3A56] dark:text-[#F3ECDD]
						hover:text-[#FF8A3D]
						transition-colors"
						aria-label="Close sidebar"
					>
						✕
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-4">
					<div v-if="userTickets.length === 0" class="text-center py-8">
						<p class="text-[#6B647A] dark:text-[#D6CCE5] text-sm">
							No tickets purchased yet
						</p>
					</div>

					<div v-else>
						<div class="flex items-center justify-between mb-3">
							<span class="font-semibold text-sm text-[#3F3A56] dark:text-[#F3ECDD]">Bought tickets</span>
							<button
								@click="showTickets = !showTickets"
								class="text-sm text-[#3F3A56] dark:text-[#F3ECDD] hover:text-[#FF8A3D] transition-colors"
							>
								<span v-if="showTickets">Hide ▴</span>
								<span v-else>Show ▾ ({{ userTickets.length }})</span>
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
										<h4 class="font-bold text-[#3F3A56] dark:text-[#F3ECDD]">
											{{ ticket.name }}
										</h4>
										<span
											class="bg-[#FF8A3D] text-white
											text-xs font-semibold
											px-2 py-1 rounded-full"
										>
											✓
										</span>
									</div>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5] mb-1">
										Location: {{ ticket.location ?? '—' }}
									</p>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5] mb-1">
										Time: {{ ticket.eventTime ?? '—' }}
									</p>
									<p class="text-sm text-[#6B647A] dark:text-[#D6CCE5]">
										Date: {{ ticket.eventDate ?? '—' }}
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
import { useUserStore } from '../stores/user'
import { useTicketStore } from '../stores/ticket'

const sidebarOpen = ref(false)
const userStore = useUserStore()
const ticketStore = useTicketStore()
const showTickets = ref(false)

const userTickets = computed(() => {
	const uid = userStore.currentUser?.id
	if (!uid) return []
	return ticketStore.getTicketsByUserId(uid)
})

</script>
