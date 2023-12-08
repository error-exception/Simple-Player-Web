<script setup lang="ts">
import {inject} from "vue";
import {Icon} from "../ts/icon/Icon";
import ScreenManager from "../ts/webgl/util/ScreenManager";
import Row from "./common/Row.vue";
import {PLAYER} from "../ts/build";
import Column from "./common/Column.vue";

defineProps<{
  stateText: string
}>()

defineEmits<{
  (e: 'settingsClick'): void
  (e: 'bpmCalcClick'): void
  (e: 'hideUI'): void
  (e: 'beatmapListClick'): void
  (e: 'notifyClick'): void
}>()

const openPlaylist = inject<Function>("openList")!!
const openMiniPlayer = inject<Function>("openMiniPlayer")!!

const switchScreen = (id: string) => ScreenManager.activeScreen(id)

</script>
<template>
  <Column class="fill-width">
    <Row class="top-bar fill-size">
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="$emit('settingsClick')"
      >
        {{ Icon.Settings }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('main')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('second')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('mania')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('legacy')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('test')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="switchScreen('story')"
      >
        {{ Icon.ScreenLockLandscape }}
      </button>
      <Row style="flex-grow: 1" center>
        <span class="text-white">{{ stateText }}</span>
      </Row>
      <button
        class="ma top-bar-icon-btn"
        v-osu-top-bar-btn
        @click="openMiniPlayer()"
      >
        {{ Icon.MusicNote }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="$emit('beatmapListClick')"
      >
        {{ Icon.FolderOpen }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="$emit('hideUI')"
      >
        {{ Icon.Fullscreen }}
      </button>
      <button
        v-osu-top-bar-btn
        v-if="PLAYER"
        class="ma top-bar-icon-btn"
        @click="$emit('bpmCalcClick')"
      >
        {{ Icon.RadioButtonUnchecked }}
      </button>
      <button
        v-osu-top-bar-btn
        v-if="PLAYER"
        class="ma top-bar-icon-btn"
        @click="openPlaylist()"
      >
        {{ Icon.List }}
      </button>
      <button
        v-osu-top-bar-btn
        class="ma top-bar-icon-btn"
        @click="$emit('notifyClick')"
      >
        {{ Icon.Notifications }}
      </button>
    </Row>
    <div class="top-bar-shadow"></div>
  </Column>
</template>
<style scoped>
.top-bar {
  height: var(--top-bar-height);
  background-color: #191919;
  padding: 2px;
}
.top-bar-icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  color: white;
}
.top-bar-icon-btn:hover {
  @apply bg-gray-700
}
.top-bar-icon-btn:active {
  @apply bg-gray-600
}
.top-bar-shadow {
  width: 100%;
  height: 120px;
  background-image: linear-gradient(black, transparent);
  transition: opacity 220ms linear;
  opacity: 0;
}
.top-bar:hover + .top-bar-shadow {
  opacity: 1;
}
</style>