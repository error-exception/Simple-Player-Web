<script setup lang="ts">
import Column from "../common/Column.vue";
import NotifyItem from "./NotifyItem.vue";
import {OsuNotification} from "../../ts/notify/OsuNotification";
import Row from "../common/Row.vue";

const messages = OsuNotification.messages
const tasks = OsuNotification.runningTasks
OsuNotification.clear(OsuNotification.tempQueue)
</script>
<template>
  <Column class="notify-box bg-[--bg-color] w-96 h-full p-4 gap-y-2">
<!--    Group 1-->
    <Column class="w-full gap-y-2">
      <Row class="w-full">
        <span class="font-bold text-[12px] text-white">NOTIFICATION</span>
        <button class="text-[12px] text-white ml-auto" @click="OsuNotification.clear(OsuNotification.messages)">CLEAR ALL</button>
      </Row>
      <TransitionGroup name="list1" tag="div" class="gap-y-2 flex flex-col">
        <NotifyItem
          v-for="item in messages"
          :key="item.id"
          :text="item.text.value" type="text"/>
      </TransitionGroup>
    </Column>
<!--    Group 2-->
    <Column class="w-full gap-y-2">
      <Row class="w-full">
        <span class="font-bold text-[12px] text-white">RUNNING TASK</span>
        <button @click="OsuNotification.clear(OsuNotification.runningTasks)" class="text-[12px] text-white ml-auto">CLEAR ALL</button>
      </Row>
      <TransitionGroup name="list1" tag="div" class="gap-y-2 flex flex-col">
        <NotifyItem
          v-for="item in tasks"
          :text="item.text.value"
          type="progress"
          :progress="item.progress.value"
          :key="item.id"
        />
      </TransitionGroup>

    </Column>
  </Column>
</template>
<style scoped>
.notify-box {
  --bg-color: #302e38;
  --item-bg-color: #3d3946;
  --item-icon-bg-color: #091b2a;
  --item-progress-color: #66ccff;
}
.list1-move,
.list1-enter-active,
.list1-leave-active {
  transition: all 220ms ease;
}
.list1-enter-from,
.list1-leave-to {
  opacity: 0;
  transform: translateX(80px);
}
.list1-leave-active {
  position: absolute;
}
</style>