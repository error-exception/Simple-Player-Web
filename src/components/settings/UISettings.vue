<template>
  <Column class="fill-size" style="padding: 16px; color: white" :gap="16">
    <Row class="fill-width">
      <input type="checkbox" v-model="store.state.settings.backgroundMovable">背景移动
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