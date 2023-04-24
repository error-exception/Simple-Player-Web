<template>
  <Column class="fill-size" style="padding: 16px; color: white" :gap="16">
    <Row class="fill-width">
      <input type="checkbox" v-model="store.state.settings.backgroundMovable">背景移动
    </Row>
    <Row class="fill-width">
      <input type="checkbox" v-model="store.state.settings.showWhiteBar">显示白条
    </Row>
  </Column>
</template>

<script lang="ts" setup>

import {useStore} from "vuex";
import Column from "../Column.vue";
import Row from "../Row.vue";

const store = useStore()

</script>

<style scoped>

</style>