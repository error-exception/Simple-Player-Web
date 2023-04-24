<template>
  <Row class="top-bar">
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="$emit('settingsClick')"
    >
      {{Icon.Settings}}
    </button>
    <div style="flex-grow: 1"></div>
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
    <button
        class="ma light-gray-click"
        style="width: 48px; height: 48px; color: white"
        @click="openThree()"
    >
      {{Icon.DeveloperMode}}
    </button>
  </Row>
</template>

<script setup lang="ts">
import {Icon} from "../ts/icon/Icon";
import {computed, inject} from "vue";
import {useStore} from "vuex";
import Row from "./Row.vue";

const store = useStore()

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

const openPlaylist = inject("openList")

const openMiniPlayer = inject("openMiniPlayer")

function openThree() {
  window.location.href = '../../threeTest/index.html'
}

</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 48px;
  background-color: var(--top-bar-bg);
}
</style>