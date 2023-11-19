<script lang="ts" setup>
import Column from "../common/Column.vue";
import Row from "../common/Row.vue";
import CheckBox from "../common/CheckBox.vue";
import {UIState} from "../../ts/global/UISettings";
</script>
<template>
  <Column class="w-full h-full text-white p-4" :gap="16">
    <Row class="w-full" center-vertical>
      <span>Logo Drag</span>
      <CheckBox class="ml-auto" v-model="UIState.logoDrag"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Logo Hover</span>
      <CheckBox class="ml-auto" v-model="UIState.logoHover"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Star Smoke</span>
      <CheckBox class="ml-auto" v-model="UIState.starSmoke"/>
    </Row>
    <Row class="w-full" center-vertical>
      <span class="flex-row">Use beatmap background</span>
      <CheckBox class="ml-auto" v-model="UIState.beatmapBackground"/>
    </Row>
  </Column>
</template>