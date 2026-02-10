<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useEventStore } from '../stores/event'
import { useUserStore } from '../stores/user'

import type { Event } from '../stores/event'

import EventCard from './EventCard.vue'
import AddEventCard from './AddEventCard.vue'
import EventFormModal from './EventFormModal.vue'

// ===== STORES =====
const eventStore = useEventStore()
const userStore = useUserStore()
const { events } = storeToRefs(eventStore)

// ===== LOCAL STATE =====
const showModal = ref(false)
const editingEvent = ref<Event | null>(null)

// ===== COMPUTED =====
const isAdmin = computed(() => userStore.isCurrentUserAdmin)

// ===== METHODS =====
const addEvent = () => {
  editingEvent.value = null
  showModal.value = true
}

const editEvent = (event: Event) => {
  editingEvent.value = event
  showModal.value = true
}

const deleteEvent = (id: string) => {
  if (!confirm('Weet je zeker dat je dit event wilt verwijderen?')) return
  eventStore.deleteEvent(id)
}

// Seed mock events als leeg
onMounted(() => {
  eventStore.seedMockEvents()
})
</script>

<template>
  <section class="bg-[#FBF6EE] dark:bg-[#1F1D2B] py-16">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-4xl font-bold mb-10 text-center">
        Evenementen
      </h2>

      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        <!-- Event Cards -->
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @edit="editEvent"
          @delete="deleteEvent"
        />

        <!-- ➕ Add Event Card -->
        <AddEventCard
          v-if="isAdmin"
          @click="addEvent"
          class="cursor-pointer"
        />
      </div>
    </div>

    <!-- Event Form Modal -->
    <EventFormModal
      v-if="showModal"
      :event="editingEvent"
      @close="showModal = false"
    />
  </section>
</template>