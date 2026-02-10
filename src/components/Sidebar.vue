<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <transition name="fade">
      <div
          v-if="isOpen"
          class="fixed inset-0 bg-black/50 z-40 cursor-pointer"
          @click="closeSidebar"
      />
    </transition>

    <!-- Sidebar Drawer -->
    <div
        :class="[
          'fixed top-0 right-0 h-screen bg-white dark:bg-[#2A263A] border-l border-[#3F3A56]/20 dark:border-[#F3ECDD]/20 w-80 shadow-2xl z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        ]"
    >
      <!-- Header -->
      <div class="bg-[#e7d6bc] dark:bg-[#3A344C] border-b border-[#3F3A56]/10 dark:border-[#F3ECDD]/10 px-4 py-3 flex items-center justify-between">
        <button
            @click="closeSidebar"
            class="ml-auto p-2 rounded-lg hover:bg-[#3F3A56]/10 dark:hover:bg-[#F3ECDD]/10 transition-colors duration-200 group"
            aria-label="Close sidebar"
        >
          <XMarkIcon class="h-5 w-5 text-[#3F3A56] dark:text-[#F3ECDD] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      <!-- Sidebar Content -->
      <div class="flex-1 overflow-y-auto">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useSidebar } from '../composables/useSidebar'

const { isOpen, closeSidebar } = useSidebar()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>