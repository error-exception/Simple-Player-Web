<script setup lang="ts">
import type {Color} from "../../ts/webgl/base/Color";
import {OSUPanelStack} from "../../ts/osu/OSUPanelStack";

defineProps<{
  themeColor: Color,
  panelId: string
}>()

const zIndex = OSUPanelStack.panelZIndex

</script>

<template>
  <div class="osu-panel-box no-scroller">
    <slot/>
  </div>
</template>

<style scoped>
.osu-panel-box {
  width: 80vw;
  position: absolute;
  height: 100vh;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  overflow-y: scroll;
  z-index: v-bind(zIndex);
}
</style>