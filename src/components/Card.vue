<template>
  <div ref="html" class="card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const p = defineProps<{
  contentPadding?: number,
  size?: number
}>()

const html = ref(null)

onMounted(() => {
  //@ts-ignore
  const div: HTMLDivElement = html.value
  if (p.size) {
    div.style.width = p.size + 'px'
    div.style.height = p.size + 'px'
  }
  if (p.contentPadding) {
    div.style.padding = p.contentPadding + 'px'
  }
})

</script>

<style scoped>

</style>