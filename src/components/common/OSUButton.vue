<script setup lang="ts">
withDefaults(defineProps<{
  fill?: boolean
}>(), {
  fill: false,
})
</script>

<template>
  <button
      class="osu-button"
      :class="{
        'w-full': fill
      }"
  >
    <slot/>
  </button>
</template>

<style scoped>
.osu-button {
  @apply rounded-full bg-pink-500 px-4 py-2 hover:bg-pink-400 active:bg-pink-300;
  box-shadow: 0 4px 8px rgba(0, 0, 0, .1);
}
</style>