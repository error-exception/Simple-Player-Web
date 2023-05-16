<template>
  <Row class="top-bar">
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="$emit('settingsClick')"
    >
      {{Icon.Settings}}
    </button>
    <Row style="flex-grow: 1" center>
      <span class="font-white">{{ stateText }}</span>
    </Row>
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="openMiniPlayer()"
    >
      {{Icon.MusicNote}}
    </button>
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="$emit('hideUI')"
    >
      {{Icon.Fullscreen}}
    </button>
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="$emit('bpmCalcClick')"
    >
      {{Icon.RadioButtonUnchecked}}
    </button>
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="openPlaylist()"
    >
      {{Icon.List}}
    </button>
  </Row>
</template>

<script setup lang="ts">
import {Icon} from "../ts/icon/Icon";
import {computed, inject} from "vue";
import {useStore} from "vuex";
import Row from "./Row.vue";
import Slider from "./Slider.vue";

const store = useStore()

defineProps<{
  stateText: string
}>()

defineEmits<{
  (e: 'settingsClick'): void
  (e: 'bpmCalcClick'): void
  (e: 'hideUI'): void
}>()

const settings = computed({
  set() {

  },
  get() {
    return store.state
  }
})

const openPlaylist = inject<Function>("openList")!!

const openMiniPlayer = inject<Function>("openMiniPlayer")!!

</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 48px;
  background-color: var(--top-bar-bg);
}
</style>