<script setup lang="ts">
import Column from "../common/Column.vue";
import NotifyItem from "./NotifyItem.vue";
import {OsuNotification} from "../../ts/notify/OsuNotification";

const queue = OsuNotification.tempQueue
</script>
<template>
  <Column class="notify-box w-96 p-4 pt-[68px] pointer-events-none">
    <TransitionGroup name="list" tag="div" class="gap-y-2 flex flex-col">
      <NotifyItem
        v-for="item in queue"
        :text="item.text.value"
        :progress="item.progress.value"
        :key="item.id"
      />
    </TransitionGroup>
  </Column>
</template>
<style scoped>
.notify-box {
  --bg-color: #302e38;
  --item-bg-color: #3d3946;
  --item-icon-bg-color: #091b2a;
  --item-progress-color: #66ccff;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 220ms ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
.list-leave-active {
  position: absolute;
}
</style>