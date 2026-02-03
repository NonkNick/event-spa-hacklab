<script setup lang="ts">
import EventDisplay from "../components/EventDisplay.vue";
import type { Event } from '../stores/event';

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
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-200 to-indigo-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Event Demo</h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="border w-80 h-100">
        <EventDisplay :event="demoEvent" />
      </div>
    </main>
  </div>
</template>