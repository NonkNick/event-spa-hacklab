<script setup lang="ts">
import { onMounted } from 'vue'
import { ref } from 'vue'
import SpeakerGrid from '../components/SpeakerGrid.vue'

const mobileMenuOpen = ref(false)

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
})

const toggleDarkMode = () => {
	const isDark = document.documentElement.classList.toggle('dark')
	localStorage.theme = isDark ? 'dark' : 'light'
}
</script>

<template>
	<div
		class="flex flex-col min-h-screen
		bg-[#FBF6EE] dark:bg-[#1F1D2B]
		text-[#3F3A56] dark:text-[#F3ECDD]
		transition-colors duration-300"
	>
		<nav
			class="w-full
			bg-[#e7d6bc] dark:bg-[#3A344C]
			text-[#3F3A56] dark:text-[#F3ECDD]
			shadow-md"
		>
			<div
				class="flex items-center justify-between
				px-4 md:px-6 py-4"
			>
				<div class="flex items-center">
					<a href="/" class="flex items-center">
						<img
							src="../assets/images/eventlab-logo.png"
							alt="Logo"
							class="h-10 w-10 md:h-12 md:w-12 mr-3"
						/>
						<div class="font-bold text-xl md:text-2xl">
							EventLab
						</div>
					</a>
				</div>

				<ul
					class="hidden md:flex
					items-center gap-12 text-lg"
				>
					<li class="hover:text-[#FF8A3D] cursor-pointer transition-colors">
						Event
					</li>
					<li class="hover:text-[#FF8A3D] cursor-pointer transition-colors">
						Sprekers
					</li>
					<li class="hover:text-[#FF8A3D] cursor-pointer transition-colors">
						Programma
					</li>
					<li class="hover:text-[#FF8A3D] cursor-pointer transition-colors">
						Tickets
					</li>
				</ul>

				<div class="flex items-center gap-4">
					<button
						@click="toggleDarkMode"
						class="py-1 px-3 rounded
						text-[#FF8A3D]
						hover:bg-[#FF8A3D] hover:text-[#3F3A56]
						transition-colors duration-300 cursor-pointer"
					>
						🌙 / ☀️
					</button>

					<button
						@click="toggleMobileMenu"
						class="md:hidden text-2xl"
						aria-label="Menu"
					>
						☰
					</button>
				</div>
			</div>

			<div
				v-if="mobileMenuOpen"
				class="md:hidden
				bg-[#e7d6bc] dark:bg-[#3A344C]
				border-t border-[#3F3A56]/10"
			>
				<ul class="flex flex-col text-center py-4 gap-0">
					<li
						class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false"
					>
						Event
					</li>
					<li
						class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false"
					>
						Sprekers
					</li>
					<li
						class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false"
					>
						Programma
					</li>
					<li
						class="hover:text-[#FF8A3D] hover:bg-[#3A344C] dark:hover:bg-[#e7d6bc] py-3 cursor-pointer transition-colors"
						@click="mobileMenuOpen = false"
					>
						Tickets
					</li>
				</ul>
			</div>
		</nav>

		<main
			class="flex-1 flex flex-col items-center text-center gap-8 py-12 px-4
			bg-[#FBF6EE] dark:bg-[#1F1D2B]"
		>
			<section
				class="w-full max-w-6xl
				bg-white dark:bg-[#2A263A]
				rounded-xl shadow-lg overflow-hidden
				transition-colors"
			>
				<div class="relative h-80">
					<img
						src="https://images.unsplash.com/photo-1503428593586-e225b39bddfe"
						class="absolute inset-0 w-full h-full object-cover"
					/>

					<div
						class="absolute inset-0
						bg-gradient-to-t
						from-black/80 via-black/40 to-transparent"
					></div>

					<div class="absolute bottom-6 left-6 right-6 text-left">
						<span
							class="inline-block mb-3
							bg-[#FF8A3D] text-white
							px-4 py-1 rounded-full text-sm font-semibold"
						>
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
							Waar code en creativiteit samenkomen, ontstaat de toekomst van het web. Vandaag staan we aan de vooravond van een nieuwe golf van innovatie, gedreven door de passie en expertise van de frontend community. Laten we samen de grenzen verleggen van wat mogelijk is en de toekomst van web development vormgeven.
						</p>
					</div>

					<div class="space-y-3 text-base">
						<div>
							<span class="font-bold">Locatie:</span> Grote Zaal
						</div>
						<div>
							<span class="font-bold">Datum:</span> 25-10-2026
						</div>
						<div>
							<span class="font-bold">Tijd:</span> 09:00 – 10:00
						</div>

						<button
							class="mt-4 w-full
							bg-[#FF8A3D] hover:bg-[#E6752F]
							text-white font-bold
							py-3 rounded-lg
							transition-colors cursor-pointer"
						>
							Tickets bestellen
						</button>
					</div>
				</div>
			</section>
		</main>

		<section class="bg-[#E7D6BC] dark:bg-[#12111A]">
			<div class="w-full max-w-6xl mx-auto mt-16 px-4">
				<h2
					class="text-4xl font-bold mb-8 text-center
					text-[#3F3A56] dark:text-[#F3ECDD]"
				>
					Programma
				</h2>

				<div
					class="flex sm:flex-row gap-4 mb-5 items-center"
				>
					<select
						class="px-4 py-2 rounded-md
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
						text-[#3F3A56] dark:text-[#F3ECDD]
						focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] cursor-pointer"
					>
						<option>Alle zalen</option>
						<option>Zaal A</option>
						<option>Zaal B</option>
						<option>Zaal C</option>
					</select>

					<select
						class="px-4 py-2 rounded-md
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/20 dark:border-[#F3ECDD]/20
						text-[#3F3A56] dark:text-[#F3ECDD]
						focus:outline-none focus:ring-2 focus:ring-[#FF8A3D] cursor-pointer"
					>
						<option>Alle tijden</option>
						<option>09:00 – 10:00</option>
						<option>10:00 – 11:00</option>
						<option>11:00 – 12:00</option>
					</select>
				</div>

				<hr class="w-full h-1 bg-[#FBF6EE] dark:bg-[#2A263A] mx-auto my-8 border-0 rounded-sm md:my-8"></hr>

				<div
					class="grid gap-6
					sm:grid-cols-2
					lg:grid-cols-3 pb-12"
				>
					<!-- Card -->
					<div
						class="relative overflow-hidden
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
						rounded-lg shadow-md
						transition-colors
						flex flex-col h-full"
					>
						<div class="relative">
							<img
								src="https://images.unsplash.com/photo-1518770660439-4636190af475"
								class="h-55 w-full object-cover"
							/>

							<div
								class="absolute inset-0
								bg-gradient-to-t
								from-black/70 via-black/30 to-transparent"
							></div>

							<div class="absolute bottom-4 left-4 right-4 text-left">
								<h3 class="text-2xl font-bold text-white leading-tight">
									Presentatie Hacklab
								</h3>
								<p class="text-base text-white/80">
									Justin Bötger
								</p>
							</div>

							<div
								class="absolute top-4 right-4
								text-base font-semibold
								bg-[#FF8A3D] text-white
								px-3 py-1 rounded-full shadow"
							>
								09:00 – 09:30
							</div>
						</div>

						<div class="p-6 text-left flex flex-col h-full">
							<p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
								Start van de Hackfront Conference met een korte introductie en
								overzicht van de dag.
							</p>

							<div class="mt-auto">
								<ul class="text-base space-y-1">
									<li>
										<span class="font-bold">Locatie:</span> Zaal A
									</li>
									<li>
										<span class="font-bold">Datum:</span> 25-10-2026
									</li>
									<li>
										<span class="font-bold">Tijd:</span> 09:00 – 09:30
									</li>
								</ul>

								<button
									class="mt-6 w-full
									bg-[#FF8A3D] hover:bg-[#E6752F]
									text-white font-semibold
									py-2 rounded-md
									transition-colors cursor-pointer"
								>
									Tickets
								</button>
							</div>
						</div>
					</div>
					<!-- Card END -->

					<!-- Card -->
					<div
						class="relative overflow-hidden
						bg-white dark:bg-[#2A263A]
						border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
						rounded-lg shadow-md
						transition-colors
						flex flex-col h-full"
					>
						<div class="relative">
							<img
								src="https://images.unsplash.com/photo-1625838144804-300f3907c110"
								class="h-55 w-full object-cover"
							/>

							<div
								class="absolute inset-0
								bg-gradient-to-t
								from-black/70 via-black/30 to-transparent"
							></div>

							<div class="absolute bottom-4 left-4 right-4 text-left">
								<h3 class="text-2xl font-bold text-white leading-tight">
									Hackathon
								</h3>
								<p class="text-base text-white/80">
									Justin Bötger
								</p>
							</div>

							<div
								class="absolute top-4 right-4
								text-base font-semibold
								bg-[#FF8A3D] text-white
								px-3 py-1 rounded-full shadow"
							>
								11:00 – 15:30
							</div>
						</div>

						<div class="p-6 text-left flex flex-col h-full">
							<p class="text-base mb-4 text-[#6B647A] dark:text-[#D6CCE5]">
								Een hackathon is een evenement waarin teams van deelnemers non-stop bezig gaan om binnen een korte tijd oplossingen voor aangereikte casussen te bedenken.
							</p>

							<div class="mt-auto">
								<ul class="text-base space-y-1">
									<li>
										<span class="font-bold">Locatie:</span> Zaal C
									</li>
									<li>
										<span class="font-bold">Datum:</span> 15-3-2026
									</li>
									<li>
										<span class="font-bold">Tijd:</span> 11:00 – 15:30
									</li>
								</ul>

								<button
									class="mt-6 w-full
									bg-[#FF8A3D] hover:bg-[#E6752F]
									text-white font-semibold
									py-2 rounded-md
									transition-colors cursor-pointer"
								>
									Tickets
								</button>
							</div>
						</div>
					</div>
					<!-- Card END -->
				</div>
			</div>
		</section>

		<section class="bg-[#FBF6EE] dark:bg-[#1F1D2B]">
				<SpeakerGrid />
		</section>



		<footer
			class="w-full py-6 text-center
			bg-[#3F3A56] dark:bg-[#2C2740]
			text-[#FFF]"
		>
			© 2026 EventLab
		</footer>
	</div>
</template>