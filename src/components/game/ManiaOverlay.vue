<script setup lang="ts">
import ComboCounter from "./ComboCounter.vue";
import JudgeCounter from "./JudgeCounter.vue";
import GameScore from "./GameScore.vue";
</script>
<template>
  <div class="w-full h-full relative">
    <JudgeCounter class="absolute left-4 top-1/2 translate-y-[-50%]"/>
    <ComboCounter class="absolute left-4 bottom-4"/>
    <GameScore class="absolute top-4 right-4" />
  </div>
</template>