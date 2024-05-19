<script setup lang="ts">
import ScreenManager from "../ts/webgl/util/ScreenManager";
import {useStateFlow} from "../ts/util/use";
const screenId = useStateFlow(ScreenManager.currentId)
const screenSource = [
  {
    name: "Lazer! Home",
    id: "main"
  },
  {
    name: "Background Preview",
    id: "second"
  },
  // {
  //   name: "Mania4K Preview",
  //   id: "mania"
  // },
  {
    name: "Test",
    id: "test"
  },
  {
    name: "Stable! Home",
    id: "legacy"
  },
  {
    name: "Storyboard",
    id: "story"
  }
]

function changeScreen(id: string) {
  ScreenManager.activeScreen(id)
}

defineEmits<{
  (e: 'close'): void
}>()
</script>
<template>
  <div
    class="screen-box h-full absolute left-0 flex items-center"
    @mouseleave="$emit('close')"
  >
    <div
      class="w-60 p-1 bg-[--bpm-color-3] rounded-r-md"
      @mouseleave="$emit('close')"
    >
      <div
        class="flex items-center gap-x-2"
        v-for="item in screenSource"
      >
        <div
          class="w-4 rounded-full bg-[--bpm-color-11] aspect-square"
          :style="{
            backgroundColor: item.id === screenId ? 'var(--bpm-color-11)' : 'transparent'
          }"
        />
        <span
          class="rounded-md w-full px-4 py-2 text-white hover:bg-[--bpm-color-6] cursor-pointer"
          @click="changeScreen(item.id)"
        >
          {{ item.name }}
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.screen-box {
  --bpm-color-1:  #171c1a;
  --bpm-color-2:  #222a27;
  --bpm-color-3:  #2e3835;
  --bpm-color-4:  #394642;
  --bpm-color-5:  #45544f;
  --bpm-color-6:  #5c7069;
  --bpm-color-7:  #ffd966;
  --bpm-color-8:  #fff27f;
  --bpm-color-9:  #66ffcc;
  --bpm-color-10: #af00af;
  --bpm-color-11: #38e7ab;
}
</style>