<script setup lang="ts">

import {Color} from "../../ts/webgl/base/Color";
import BasicButton from "../common/BasicButton.vue";
import Row from "../common/Row.vue";

defineProps<{
  icon: string,
  title: string,
  active: boolean
}>()

const color = Color.fromHex(0x24222a)

</script>

<template>
  <BasicButton
      :color="color"
      class="rounded-md px-6 py-2"
  >
    <Row
        :gap="4"
        center-vertical
        class="selector-item"
        :class="{
          'selector-item-selected': active
        }"
    >
      <div/>
      <div class="ma">{{ icon }}</div>
      <div>{{ title }}</div>
    </Row>
  </BasicButton>
</template>

<style scoped>
.selector-item {
  @apply text-white cursor-pointer opacity-75;
  font-size: 14px;
}
.selector-item > div:first-child {
  @apply w-1 bg-pink-500 h-0 rounded-full transition-all mr-4;
}

.selector-item > div:nth-child(2) {
  @apply mr-2;
  font-size: 24px;
}

.selector-item-selected {
  @apply opacity-100;
}

.selector-item-selected > div:first-child {
  @apply h-6;
}
</style>