<script setup lang="ts">

</script>

<template>
  <div class="absolute">
    <div class="scroll-container-scroller">

    </div>
  </div>
</template>

<style scoped>
.scroll-container-scroller {
  width: 8px;
  min-height: 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, .5);
}
.scroll-container-scroller:hover {
  background-color: rgba(255, 255, 255, .8);
}
.scroll-container-scroller:active {
  @apply bg-green-400;
  font-weight: lighter;
}
</style>