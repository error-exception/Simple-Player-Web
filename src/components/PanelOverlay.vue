<script setup lang="ts">
import Mask from "./Mask.vue";
import BeatmapListPanel from "./panel/beatmapList/BeatmapListPanel.vue";
import {useSingleEvent} from "../ts/util/SingleEvent";
import {OSUPanelStack, type PanelStack} from "../ts/osu/OSUPanelStack";
import {reactive, ref} from "vue";
import BeatmapDetailsPanel from "./panel/beatmapDetails/BeatmapDetailsPanel.vue";
import HelpPanel from "./panel/help/HelpPanel.vue";
import TestPanel from "./panel/test/TestPanel.vue";

const showMask = ref(false)

const showState = reactive({
  beatmapList: false,
  beatmapDetails: false,
  help: false,
  test: false
})

useSingleEvent<void>(OSUPanelStack.onAllPanelsPopped, () => {
  showMask.value = false
})

useSingleEvent<PanelStack>(OSUPanelStack.onPanelPushed, () => {
  showMask.value = true
})

useSingleEvent<PanelStack>(OSUPanelStack.onPanelPushed, ({name}) => {
  if (name === "beatmapList") {
    showState.beatmapList = true
  } else if (name === "beatmapDetails") {
    showState.beatmapDetails = true
  } else if (name === 'help') {
    showState.help = true
  } else if (name === 'test') {
    showState.test = true
  }
})

useSingleEvent<PanelStack>(OSUPanelStack.onPanelPopped, ({ name }) => {
  if (name === "beatmapList") {
    showState.beatmapList = false
  } else if (name === "beatmapDetails") {
    showState.beatmapDetails = false
  } else if (name === 'help') {
    showState.help = false
  } else if (name === 'test') {
    showState.test = false
  }
})

function popPanelStack() {
  OSUPanelStack.pop()
}

</script>
<template>
  <div class="panel-overlay-box">
    <Transition name="mask-box">
      <Mask class="absolute" v-if="showMask" @click="popPanelStack()"/>
    </Transition>
    <Transition name="osu-panel-box">
      <BeatmapListPanel v-if="showState.beatmapList"/>
    </Transition>
    <Transition name="osu-panel-box">
      <BeatmapDetailsPanel v-if="showState.beatmapDetails"/>
    </Transition>
    <Transition name="osu-panel-box">
      <HelpPanel v-if="showState.help"/>
    </Transition>
    <Transition name="osu-panel-box">
      <TestPanel v-if="showState.test"/>
    </Transition>
  </div>
</template>
<style scoped>
.panel-overlay-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 400;
  pointer-events: none;
}
.mask-box-enter-from, .mask-box-leave-to {
  opacity: 0;
}
.mask-box-enter-active {
  transition: opacity 500ms ease;
}
.mask-box-leave-active {
  transition: opacity 500ms ease;
}
.mask-box-enter-to, .mask-box-leave-from {
  opacity: 1;
}

.osu-panel-box-enter-from,
.osu-panel-box-leave-to {
  transform: translateY(100%) translateX(-50%);
}
.osu-panel-box-enter-to,
.osu-panel-box-leave-from {
  transform: translateY(0) translateX(-50%);
}
.osu-panel-box-enter-active {
  transition: transform 500ms ease;
}
.osu-panel-box-leave-active {
  transition: transform 500ms ease;
}
</style>