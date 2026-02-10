<script setup lang="ts">
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid'
import type { CartItem } from '../composables/useShoppingCart'
import { useShoppingCart } from '../composables/useShoppingCart'

defineProps<{ item: CartItem }>()

const { increaseAmount, decreaseAmount, removeFromCart } = useShoppingCart()
</script>

<template>
  <div
      class="bg-[#FBF6EE] dark:bg-[#1F1D2B]
           border border-[#3F3A56]/10 dark:border-[#F3ECDD]/10
           rounded-lg p-3
           transition-colors"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1">
        <h4 class="font-bold text-[#3F3A56] dark:text-[#F3ECDD] leading-tight">
          {{ item.ticketType.name }}
        </h4>
        <p v-if="item.ticketType.description" class="text-xs text-[#6B647A] dark:text-[#D6CCE5]">
          {{ item.ticketType.description }}
        </p>
      </div>

      <span
          class="bg-[#FF8A3D] text-white
               text-xs font-semibold
               px-2 py-1 rounded-full whitespace-nowrap ml-2"
      >
        €{{ item.ticketType.price }}
      </span>
    </div>

    <div
        class="flex items-center justify-between pt-3
             border-t border-[#3F3A56]/10 dark:border-[#F3ECDD]/10"
    >
      <div class="flex items-center gap-2">
        <button
            @click="decreaseAmount(item.eventId, item.ticketType)"
            class="w-7 h-7 rounded-full
                 bg-[#e7d6bc] dark:bg-[#3A344C]
                 text-[#3F3A56] dark:text-[#F3ECDD]
                 hover:bg-[#FF8A3D] hover:text-white
                 transition-colors
                 flex items-center justify-center"
            aria-label="Decrease quantity"
        >
          <MinusIcon class="h-4 w-4" />
        </button>

        <span
            class="text-sm font-semibold
                 text-[#3F3A56] dark:text-[#F3ECDD]
                 w-8 text-center"
        >
          {{ item.quantity }}
        </span>

        <button
            @click="increaseAmount(item.eventId, item.ticketType)"
            class="w-7 h-7 rounded-full
                 bg-[#e7d6bc] dark:bg-[#3A344C]
                 text-[#3F3A56] dark:text-[#F3ECDD]
                 hover:bg-[#FF8A3D] hover:text-white
                 transition-colors
                 flex items-center justify-center"
            aria-label="Increase quantity"
        >
          <PlusIcon class="h-4 w-4" />
        </button>
      </div>

      <button
          @click="removeFromCart(item.eventId, item.ticketType)"
          class="text-[#6B647A] dark:text-[#D6CCE5]
               hover:text-red-500
               transition-colors"
          aria-label="Verwijder item"
      >
        <TrashIcon class="h-5 w-5" />
      </button>
    </div>

    <div class="mt-2 text-right text-xs text-[#6B647A] dark:text-[#D6CCE5]">
      Subtotaal: €{{ (item.ticketType.price * item.quantity).toFixed(2) }}
    </div>
  </div>
</template>