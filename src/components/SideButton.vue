<script setup lang="ts">
defineEmits<{
  (e: 'sideClick'): void
}>()
</script>
<template>
  <div
    class="absolute h-full w-1 bg-white opacity-0 hover:opacity-20 left-0 transition"
    @mouseenter="$emit('sideClick')"
  ></div>
</template>
<style scoped></style>