<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div
    class="flex items-center justify-center w-full max-w-xs h-60
           border-2 border-dashed border-[#FF8A3D]
           rounded-xl cursor-pointer text-[#FF8A3D]
           hover:bg-[#FF8A3D]/10 transition"
    @click="$emit('click')"
  >
    <span class="text-5xl font-bold">＋</span>
  </div>
</template>