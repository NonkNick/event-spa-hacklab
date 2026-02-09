<script setup lang="ts">
import { ref } from 'vue'
import { useShoppingCart } from '../composables/useShoppingCart'
import ShoppingCartItem from './ShoppingCartItem.vue'
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const { cart, purchase, getTotalPrice, isEmpty } = useShoppingCart()

const isProcessing = ref(false)
const orderId = ref<string | null>(null)

const handleCheckout = async () => {
  isProcessing.value = true
  // Mock backend delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  orderId.value = await purchase()
  isProcessing.value = false
}

const reset = () => {
  orderId.value = null
}
</script>

<template>
  <div class="space-y-4">
    <!-- Success State -->
    <div v-if="orderId" class="text-center py-8 animate-in fade-in zoom-in duration-300">
      <CheckCircleIcon class="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h4 class="text-xl font-bold text-[#3F3A56] dark:text-[#F3ECDD] mb-2">Bedankt voor je bestelling!</h4>
      <p class="text-sm text-[#6B647A] dark:text-[#D6CCE5] mb-6">
        Je bestelnummer is: <span class="font-mono font-bold text-[#FF8A3D]">{{ orderId }}</span>
      </p>
      <button
          @click="reset"
          class="px-6 py-2 bg-[#3F3A56] text-white rounded-md hover:bg-[#2A263A] transition-colors"
      >
        Terug naar winkel
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="isEmpty() && !isProcessing" class="text-center text-[#6B647A] dark:text-[#D6CCE5] py-4">
      <p class="text-sm">Je winkelwagen is leeg</p>
    </div>

    <!-- Cart Items and Checkout -->
    <div v-else class="space-y-3 relative">
      <!-- Processing Overlay -->
      <div v-if="isProcessing" class="absolute inset-0 bg-white/80 dark:bg-[#1F1D2B]/80 z-10 flex flex-col items-center justify-center rounded-lg">
        <ArrowPathIcon class="h-10 w-10 text-[#FF8A3D] animate-spin mb-2" />
        <p class="text-sm font-semibold text-[#3F3A56] dark:text-[#F3ECDD]">Verwerken...</p>
      </div>

      <div class="space-y-3">
        <ShoppingCartItem
            v-for="item in cart"
            :key="`${item.eventId}-${item.ticketType.name}`"
            :item="item"
        />

        <div class="border-t border-[#3F3A56]/10 dark:border-[#F3ECDD]/10 pt-4">
          <div class="flex justify-between mb-4 text-[#3F3A56] dark:text-[#F3ECDD]">
            <span class="font-semibold">Totaal:</span>
            <span class="font-bold text-lg">€{{ getTotalPrice().toFixed(2) }}</span>
          </div>

          <button
              class="w-full px-4 py-3 bg-[#FF8A3D] text-white rounded
                     hover:bg-[#E6752F] transition-colors font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center"
              :disabled="isEmpty() || isProcessing"
              @click="handleCheckout"
          >
            <ArrowPathIcon v-if="isProcessing" class="h-5 w-5 mr-2 animate-spin" />
            {{ isProcessing ? 'Verwerken...' : 'Afrekenen' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>