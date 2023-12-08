<script setup lang="ts">
import {Judge} from "../../ts/Judge";
</script>
<template>
  <div class="flex flex-col gap-y-2 w-40">
    <div class="flex flex-row gap-x-4 text-3xl">
      <span class="text-blue-600 w-12">P</span>
      <span class="text-white">{{ Judge.perfect }}</span>
    </div>
    <div class="flex flex-row gap-x-4 text-3xl">
      <span class="text-green-600 w-12">G</span>
      <span class="text-white">{{ Judge.good }}</span>
    </div>
    <div class="flex flex-row gap-x-4 text-3xl">
      <span class="text-orange-600 w-12">B</span>
      <span class="text-white">{{ Judge.bad }}</span>
    </div>
    <div class="flex flex-row gap-x-4 text-3xl">
      <span class="text-red-600 w-12">M</span>
      <span class="text-white">{{ Judge.miss }}</span>
    </div>
  </div>
</template>